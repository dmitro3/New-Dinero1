import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { deleteCache, getCache } from '@src/libs/redis'
import { ClaimWelcomeBonusHandler } from '@src/services/bonus/welcomeBonus/claimWelcomeBonus.handler'
import db from '@src/db/models'

export class VerifyOtpHandler extends BaseHandler {
  async run() {

    const { userId, otp } = this.args
    const transaction = this.context.sequelizeTransaction
    const user = await db.User.findOne({
      where: { userId },
      transaction
    })


    if (user.isEmailVerified) {
      throw new AppError(Errors.EMAIL_ALREADY_VERIFIED)
    }
    `${user.userId}:${otp}`
    const userEmail = await getCache(`${userId}:${otp}`)

    if (!userEmail)
      throw new AppError(Errors.INVALID_OTP)

    await deleteCache(`${userId}:${otp}`)
    user.isEmailVerified = true
    user.email = userEmail
    await user.save({ transaction })
    await ClaimWelcomeBonusHandler.execute({ userId }, this.context)


    return { success: true }
  }
}
