import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'
import { getLevelDetails } from '@src/utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' }
  },
  required: ['user']
}



export class GetLoyaltyDetailsHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { user } = this.args

  
      const loyalty = (await db.GlobalSetting.findOne({
        attributes: ['value'],
        where: { key: 'LOYALTY_LEVEL' },
        raw: true
      })).value

      const currency = (await db.Currency.findOne({
        attributes: ['loyaltyPoint'],
        where: { code: user.currencyCode }
      })).loyaltyPoint

      const loyaltyDetails = {
        currentPoint: user.loyaltyPoints
      }

      loyaltyDetails.pointPerUnit = currency

      const { startPoint, endPoint, maxLevel, level } = getLevelDetails({ loyaltyLevels: loyalty, currentPoint: loyaltyDetails.currentPoint })

      if (isNaN(level) || level === undefined || level === null) {
        loyaltyDetails.level = user.level
      } else {
        loyaltyDetails.level = level
        if (user.level !== level) await user.set({ level }).save()
      }

      loyaltyDetails.startPoint = startPoint
      loyaltyDetails.endPoint = endPoint
      loyaltyDetails.maxLevel = maxLevel

      return { loyaltyDetails, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
