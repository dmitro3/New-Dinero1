import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import { Op } from 'sequelize'

import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'
import { pageValidation, filterByGameName } from '@src/utils/common'

export class GetSubCategoryGameHandler extends BaseHandler {
   async run () {
    let { limit, pageNo, subCategoryId, search, providerId, userId } = this.args
    let query = { isActive: true }
    let include = []
    let searchByName

  
      const { page, size } = pageValidation(pageNo, limit)

      if (subCategoryId) query = { ...query, casinoCategoryId: subCategoryId }
      // else if (subCategoryId !== 'all') throw new AppError(Errors.SUB_CATEGORY_REQUIRED)

      if (search) searchByName = filterByGameName(query, search)
      if (providerId) {
        providerId = JSON.parse(providerId)
        query = { ...query, casinoProviderId: { [Op.in]: providerId } }
      }
      // if (deviceType) query = { ...query, devices: { [Op.contains]: [deviceType] } }

      // const restricted = await getLocation(ipAddress)
      // if (!restricted) throw new AppError(Errors.COUNTRY_NOT_FOUND)

      // if (restricted.restrictedGames?.length) {
      //   const gamesArray = Array.prototype.concat.apply([], restricted.restrictedGames)
      //   games = { casinoGameId: { [Op.notIn]: gamesArray } }
      // }

      // if (restricted.restrictedProviders?.length) {
      //   providers = { casinoProviderId: { [Op.notIn]: restricted.restrictedProviders } }
      // }

      let attributes = ['id', 'orderId', 'casinoGameId', 'casinoCategoryId', 'name', 'thumbnailUrl', 'casinoProviderId', 'returnToPlayer', 'demo', 'devices', 'isFeatured', 'moreDetails']

      if (userId) {
        include = [{
          model: db.CasinoFavoriteGame,
          where: { userId },
          attributes: [],
          required: false
        }]

        attributes = [...attributes, [db.Sequelize.literal('"CasinoFavoriteGame"."id" IS NOT NULL'), 'isFavorite']]
      }

      const casinoGames = await db.CasinoGame.findAndCountAll({
        where: { ...query, ...searchByName },
        order: [['isFeatured', 'DESC'], ['orderId', 'ASC']],
        limit: size,
        offset: ((page - 1) * size),
        include: [...include],
        attributes
      })

      if (!casinoGames) {
        throw new AppError(Errors.CATEGORY_GAME_NOT_FOUND)
      }

      if (casinoGames.count && casinoGames.rows.length) casinoGames.gameSubCategoryId = casinoGames.rows[0].gameSubCategoryId

      return { casinoGames, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
