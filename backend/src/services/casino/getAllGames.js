import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { filterByGameSubCategory, pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'
import { Op } from 'sequelize'

export class GetAllGamesHandler extends BaseHandler {
  async run() {
    let { limit, pageNo, rating, category, provider, search, userId, deviceType, ipAddress, isFeatured } = this.args

    let query = { isActive: true }
    const { page, size } = pageValidation(pageNo, limit)

    let providerQuery

    if (search) query = filterByGameSubCategory(query, search)
    if (category) {
      query.casinoCategoryId = category
      // if (typeof (category) !== 'object') category = JSON.parse(category)
    }
    if (provider) {
      query.casinoProviderId = provider
      // if (typeof (provider) !== 'object') provider = JSON.parse(provider)
      // if (provider.length) providerQuery = { name: { [Op.in]: provider } }
    }

    if (rating) {
      if (typeof (rating) !== 'object') rating = JSON.parse(rating)
    }
    if (deviceType) query = { devices: { [Op.contains]: [deviceType] } }
    if (isFeatured) query = { ...query, isFeatured: JSON.parse(isFeatured) }

    // const restricted = await getLocation(ipAddress)
    // if (!restricted) throw new AppError(Errors.COUNTRY_NOT_FOUND)

    let include = [
      {
        model: db.CasinoProvider,
        where: { isActive: true, ...providerQuery },
        as: 'CasinoProvider',
        required: true,
        attributes: ['name']
      },
      {
        model: db.CasinoCategory,
        where: { isActive: true },
        required: true,
        attributes: ['name']
      }
    ]

    let casinoGameAttribute = ['id', 'orderId', 'casinoGameId', 'createdAt', 'name', 'casinoProviderId', 'devices', 'thumbnailUrl', 'mobileThumbnailUrl', 'returnToPlayer', 'demo', 'isFeatured', 'moreDetails']
    if (userId) {
      include = [...include, {
        model: db.CasinoFavoriteGame,
        as: 'CasinoFavoriteGames',
        where: { userId },
        attributes: [[db.sequelize.literal('"CasinoFavoriteGames"."id" IS NOT NULL'), 'isFavorite']],
        required: false,
      }]
    }

    const categoryGames = await db.CasinoGame.findAndCountAll({
      where: { ...query },
      order: [['isFeatured', 'DESC'], ['orderId', 'ASC']],
      include,
      limit: size,
      offset: ((page - 1) * size),
      attributes: casinoGameAttribute
    })

    const casinoGames = categoryGames.rows.map((game) => {
      const isFavorite = Boolean(game.CasinoFavoriteGames ? game.CasinoFavoriteGames[0]?.dataValues.isFavorite : false)
      delete game.dataValues.CasinoFavoriteGames
      game.dataValues.isFavorite = isFavorite
      return game
    })


    categoryGames.rows = casinoGames
    if (!categoryGames) {
      throw new AppError(Errors.GAME_NOT_FOUND)
    }
    return { categoryGames, message: SUCCESS_MSG.GET_SUCCESS }

  }
}
