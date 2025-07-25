import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetCurrencyLimit extends BaseHandler {
   async run () {
  
      const currencyLimits = await db.GlobalSetting.findAll({
        where: {
          key: {
            [db.Sequelize.Op.in]: ['WITHDRAW_LIMIT', 'DEPOSIT_LIMIT']
          }
        },
        attributes: ['key', 'value']
      })

      return { currencyLimits, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
