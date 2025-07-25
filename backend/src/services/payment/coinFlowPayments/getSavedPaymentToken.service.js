import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { Logger } from '@src/libs/logger'
const { Op } = require('sequelize');
import { BaseHandler } from '@src/libs/logicBase'

export class GetCoinFlowUserSavedPaymentTokenService extends BaseHandler {
  async run () {
    try {
      const { userId, paymentType } = this.args
      const whereCondition = {}
      if (paymentType) {
        whereCondition.paymentType = paymentType
      }

      const savedPayments = await db.PaymentDetail.findAll({
        where: {
          ...whereCondition,
          userId,
          hasCheckoutPermission: true,
          isActive: true,
          token: {
            [Op.not]: null
          }
        },
        attributes: ['id', 'userId', 'paymentType', 'lastFourDigits', 'provider']
      });


      return {
        success: true,
        data: savedPayments || []
      }

    } catch (error) {
      Logger.error('Error in GetCoinFlowUserSavedPaymentTokenService', { exception: error })
      throw new AppError(Errors.INTERNAL_ERROR)
    }
  }
}
