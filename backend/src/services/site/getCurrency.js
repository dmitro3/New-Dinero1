import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import { getAll } from '../helper/crud'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'

export class GetCurrencyHandler extends BaseHandler {
   async run () {
  
      const { type } = this.args
      let query = { isActive: true, isPrimary: true }

      if (type) query = { ...query, type }
      const currency = await getAll({
        model: db.Currency,
        data: query,
        order: [['currencyId', 'ASC']],
        attributes: ['currencyId', 'name', 'symbol', 'code', 'type']
      })

      if (!currency) throw new AppError(Errors.CURRENCY_NOT_FOUND)

      return { currency, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
