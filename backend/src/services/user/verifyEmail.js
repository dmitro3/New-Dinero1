import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import Jwt from 'jsonwebtoken'

import db from '@src/db/models'
import config from '@src/configs/app.config'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'
import { addJoiningBonus, addReferralAmountToUser } from '@src/utils/common'
// import { TransactionHandlerHandler } from '../wallet'
import { getOne, updateEntity } from '../helper/crud'
import { sendEmail } from '../helper/email'
// import { BONUS_TYPE, EMAIL_SUBJECTS, EMAIL_TEMPLATE_TYPES, BONUS_STATUS, ROLE, KEYS, AMOUNT_TYPE, TRANSACTION_TYPE, TRANSACTION_STATUS } from '@src/utils/constant'
import { EMAIL_SUBJECTS, EMAIL_TEMPLATE_TYPES } from '@src/utils/constant'

export class VerifyEmailHandler extends BaseHandler {
   async run () {
    const { emailToken } = this.args
    let emailTokenData
    const transaction = this.context.sequelizeTransaction

    try {
      try {
        emailTokenData = Jwt.verify(emailToken, config.get('jwt.emailTokenKey'))
        if (!emailTokenData) throw new AppError(Errors.INVALID_TOKEN)
      } catch (ERROR) {
        throw new AppError(Errors.INVALID_TOKEN_ERROR_TYPE, ERROR)
      }

      const userData = await getOne({
        model: db.User,
        data: { uniqueId: emailTokenData.userId },
        include: { model: db.Wallet, as: 'userWallets' },
        transaction
      })

      const userFrontendUrl = config.get('app.userFrontendUrl')
      if (!userData) throw new AppError(Errors.USER_NOT_EXISTS)

      if (userData.isEmailVerified) {
        return {
          success: true,
          link: `${userFrontendUrl}/login?emailVerified=true`,
          message: SUCCESS_MSG.STATUS_UPDATED
        }
      }

      await updateEntity({
        model: db.User,
        data: { isEmailVerified: true, level: 1, emailToken: '' },
        values: { uniqueId: emailTokenData.userId },
        transaction
      })
      const emailSent = await sendEmail({
        user: userData,
        emailTemplate: EMAIL_TEMPLATE_TYPES.REGISTRATION_WELCOME,
        data: {
          link: `${userFrontendUrl}/`,
          subject: EMAIL_SUBJECTS[userData.locale].userActivate || EMAIL_SUBJECTS.EN.userActivate
        },
        message: SUCCESS_MSG.EMAIL_SENT
      })
      console.log(emailSent)

      // Referral Ammount add
      if (userData.refParentId) {
        const referee = userData.refParentId
        const referralAmount = await getOne({
          model: db.GlobalSetting,
          data: { key: 'REFERRAL_PERCENTAGE' },
          attributes: ['key', 'value'],
          transaction
        })
        const currency = await db.Currency.findOne({
          where: { code: referralAmount.value.currencyCode }
        })
        try {
          await addReferralAmountToUser(referee, referralAmount, currency.dataValues.currencyId)
        } catch (errors) {
          console.log(errors)
          this.addError('addReferralAmountToUserError', errors)
        }
      }
      await transaction.commit()

      // Add Referral Bonus
      try {
        // await addJoiningBonus(userData.userId)
      } catch (errors) {
        console.log(errors)
        this.addError('addJoiningBonusError', errors)
      }

      return {
        success: true,
        link: `${userFrontendUrl}/login?emailVerified=true`,
        message: SUCCESS_MSG.STATUS_UPDATED
      }
    } catch (error) {
      console.log(error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
