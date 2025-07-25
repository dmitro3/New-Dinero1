import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    currencyCode: { type: 'string' },
    hideZero: { type: 'boolean' },
    displayCryptoInFlat: { type: 'boolean' },
    faitCurrencyCode: { type: 'string' }
  },
  required: ['id']
}



export class UpdateUserCurrencyHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { id, currencyCode, hideZero, displayCryptoInFlat, faitCurrencyCode } = this.args
  
      const existingUser = await db.User.findOne({
        where: { userId: id },
        attributes: ['other']
      })

      const isPrimary = await db.Currency.findOne({
        where: { code: currencyCode, isPrimary: false }
      })
      if (isPrimary) throw new AppError(Errors.NOT_PRIMARY_CURRENCY)

      const updatedOtherFieldData = {
        ...existingUser.other
      }

      if (hideZero !== undefined) {
        updatedOtherFieldData.hideZero = hideZero
      }

      if (displayCryptoInFlat !== undefined) {
        updatedOtherFieldData.displayCryptoInFlat = displayCryptoInFlat
      }

      if (faitCurrencyCode) {
        updatedOtherFieldData.faitCurrencyCode = faitCurrencyCode
      } else {
        updatedOtherFieldData.faitCurrencyCode = ''
      }

      const updatedUser = await db.User.update({ currencyCode, other: updatedOtherFieldData }, {
        where: { userId: id }
      })

      return { updatedUser, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
