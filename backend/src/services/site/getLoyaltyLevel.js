import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { setLoyaltySequence } from '@src/utils/common'

export class GetLoyaltyLevelHandler extends BaseHandler {
   async run () {
  
      const loyaltyLevel = (await db.GlobalSetting.findOne({
        attributes: ['value'],
        where: { key: 'LOYALTY_LEVEL' },
        raw: true
      })).value

      if (!loyaltyLevel) throw new AppError(Errors.TENANT_LOYALTY_LEVELS_NOT_FOUND)

      return { loyaltyLevel: setLoyaltySequence(loyaltyLevel) }
   
  }
}
