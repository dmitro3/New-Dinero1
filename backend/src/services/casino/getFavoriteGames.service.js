import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
// import { SUCCESS_MSG } from '@src/utils/success'
import { filterByGameName, pageValidation } from '@src/utils/common' // getLocation,

export class GetFavoriteGamesHandler extends BaseHandler {
  async run() {
    // const { id, limit, pageNo, search, userId } = this.args
    const { limit, pageNo, search, userId } = this.args
    console.log(this.args)

    const { page, size } = pageValidation(pageNo, limit)

    let searchByName, query
    if (search) searchByName = filterByGameName(query, search)

    const favoriteGames = await db.CasinoFavoriteGame.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: size,
      offset: ((page - 1) * size),
      include: [
        {
          model: db.CasinoGame,
          as: 'CasinoFavoriteGames',
          where: { ...searchByName, isActive: true },
          required: true,
          include: [
            {
              model: db.CasinoCategory,
              where: { isActive: true },
              attributes: ['name'],
              required: true
            },
            {
              model: db.CasinoProvider,
              as: 'CasinoProvider',
              where: { isActive: true },
              attributes: ['name'],
              required: true
            }
          ],
          attributes: ['id', 'isActive', 'name', 'thumbnailUrl', 'mobileThumbnailUrl', 'casinoProviderId', 'returnToPlayer', 'demo', 'devices',
            [db.Sequelize.literal('true'), 'isFavorite']
          ]
        }
      ]
    })

    if (!favoriteGames) throw new AppError(Errors.FAVORITE_GAMES_NOT_FOUND)

    return { favoriteGames }

  }
}
