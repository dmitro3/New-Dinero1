import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { BaseHandler } from '@src/libs/logicBase'
import { pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: ['string', 'null']
    },
    pageNo: {
      type: ['string', 'null']
    },
    actionType: {
      type: ['string', 'null']
    },
    search: {
      type: ['string', 'null']
    }
  }
}



export class GetLeaderBoardDetails extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { limit, pageNo, actionType, search } = this.args
    let query, gameName
    if (actionType) query = { actionType: actionType }
    if (search) gameName = { name: { [Op.iLike]: `%${search}%` } }
  
      const { page, size } = pageValidation(pageNo, limit)
      const leaderBoardData = await db.CasinoTransaction.findAndCountAll({
        where: query || {},
        order: [['createdAt', 'DESC']],
        limit: size,
        offset: ((page - 1) * size),
        attributes: ['userId', 'casinoGameId', 'amount', 'currencyCode', 'createdAt', 'actionType'],
        include: [
          {
            model: db.User,
            attributes: ['email', 'profileImage', 'isGhostMode',[db.Sequelize.literal('CASE WHEN is_ghost_mode = false THEN username ELSE NULL END'), 'username']] ,
            required: false
          },
          {
            model: db.CasinoGame,
            where: gameName,
            attributes: ['name'],
          }
        ]
      })

      return { leaderBoardData, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
