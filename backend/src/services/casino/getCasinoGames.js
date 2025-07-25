import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { BaseHandler } from '@src/libs/logicBase'
import { filterByGameName, pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  required: ['ipAddress'],
}

const constraints = ajv.compile(schema)

export class GetCasinoGamesHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    const {
      limit,
      pageNo,
      categoryId,
      search,
      providerId,
      deviceType,
      userId,
      ipAddress,
    } = this.args

    // Validate pagination
    const { page, size } = pageValidation(pageNo, limit)

    // Base query
    let queryCategoy = { isActive: true };
    let queryGames = { isActive: true };
    let include = [];

    // Category filter
    if (categoryId && categoryId !== 'all') {
      queryCategoy = { ...queryCategoy, id: categoryId };
    }

    // Search by name
    if (search) {
      queryGames = filterByGameName(queryGames, search);
    }

    // Provider filter
    if (providerId) {
      if (Array.isArray(providerId)) {
        queryGames.casinoProviderId = { [Op.in]: providerId };
      } else {
        queryGames.casinoProviderId = providerId;
      }
    }

    // Device type filter
    if (deviceType) {
      queryGames = { ...queryGames, devices: { [Op.contains]: [deviceType] } };
    }

    // // Check location restrictions
    // const restricted = await getLocation(ipAddress)
    // if (!restricted) {
    //   return this.addError('CountryNotFoundErrorType')
    // }

    // Define attributes for casino games
    const casinoGameAttributes = [
      'id',
      'orderId',
      'casinoGameId',
      'createdAt',
      'name',
      'casinoProviderId',
      'devices',
      'thumbnailUrl',
      'mobileThumbnailUrl',
      'returnToPlayer',
      'demo',
      'isFeatured'
    ]

    // Include favorite games for logged-in users
    if (userId) {
      include.push({
        model: db.CasinoFavoriteGame,
        as: 'CasinoFavoriteGames',
        where: { userId },
        attributes: [[db.sequelize.literal('"CasinoFavoriteGames"."id" IS NOT NULL'), 'isFavorite']],
        required: false,
      })
    }

    // Fetch casino games
    const casinoGamesData = await db.CasinoCategory.findAndCountAll({
      where: queryCategoy,
      order: [['orderId', 'ASC']],
      include: [
        {
          model: db.CasinoGame,
          as: 'CasinoGames',
          where: queryGames,
          order: [['isFeatured', 'DESC'], ['orderId', 'ASC']],
          include,
          attributes: casinoGameAttributes,
          limit: size,
          offset: (page - 1) * size,
          include: [
            {
              model: db.CasinoProvider,
              where: { isActive: true },
              required: true,
              attributes: ['isActive']
            },
          ]
        },
      ],
    })
    const casinoGames = casinoGamesData.rows.map((category) => {
      category.CasinoGames = category.CasinoGames.map((game) => {
        const isFavorite = Boolean(game.CasinoFavoriteGames ? game.CasinoFavoriteGames[0]?.dataValues.isFavorite : false)
        delete game.dataValues.CasinoFavoriteGames
        game.dataValues.isFavorite = isFavorite
        return game
      })
      return category
    })

    const response = {
      casinoGames,
      count: casinoGamesData.count,
      categoryId: casinoGamesData.rows?.[0]?.categoryId || null,
      message: SUCCESS_MSG.GET_SUCCESS,
    }

    return response
  }
}
