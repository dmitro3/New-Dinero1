import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { createAccessToken } from '@src/helpers/authentication.helpers'
import { serverDayjs } from '@src/libs/dayjs'
import { BaseHandler } from '@src/libs/logicBase'
import { encryptPassword } from '@src/utils/common'
import { USER_VIP_TIER_PROGRESS_KEYS, VIP_TIER } from '@src/utils/constants/constants'
import { CreateAffiliateuserHandler } from '../affiliate/commission.service'
import { AddUserTierProgressHandler } from '../userTierProgress'
import { TierHandlerHandler } from '../vipTier'

export class UserSignUpHandler extends BaseHandler {
  async run() {
    const { firstName, lastName, language, username, password, referralCode } = this.args
    let refParentId
    const transaction = this.context.sequelizeTransaction

    const checkUsername = await db.User.findOne({
      where: { username },
      attributes: ['username', 'userId'],
      transaction
    })
    if (checkUsername) throw new AppError(Errors.USER_ALREADY_EXISTS)

    const currencies = (await db.Currency.findAll({
      attributes: ['code']
    })).map((obj) => ({
      code: obj.code
    }))

    const walletObjects = currencies.map(currency => ({
      currencyCode: currency.code,
      balance: 0
    }))

    // check if referral code is provided
    if (referralCode) {
      const refUser = await db.User.findOne({
        where: { username: referralCode.split('_')[1] },
        attributes: ['userId'],
        transaction
      })
      // if (!refUser) throw new AppError(Errors.INVALID_REFERRAL_CODE)
      refParentId = refUser?.userId
    }

    const user = await db.User.create(
      {
        password: encryptPassword(password),
        firstName,
        lastName,
        username,
        lastLoginDate: serverDayjs().utc().toDate(),
        refParentId,
        isEmailVerified: false,
        locale: language,
        userWallet: walletObjects
      },
      {
        include: { model: db.Wallet, as: 'userWallet' },
        transaction
      })


    // if (referralCode && refParentId) await ReferralBonusHandler.execute({ user, transaction })
    if (referralCode && refParentId) await CreateAffiliateuserHandler.execute({ referredUserId: user.userId, affiliateUserId: refParentId }, this.context)

    // Assign default tier to user while Sign up
    await TierHandlerHandler.execute({ userId: user.userId, level: VIP_TIER.DEFAULT_TIER }, this.context)

    if (referralCode && refParentId) {
      await AddUserTierProgressHandler.execute({
        userId: refParentId,
        referralsCount: USER_VIP_TIER_PROGRESS_KEYS.referralsCount
      }, this.context)

    }
    
    await db.Limit.create({
      userId: user.userId,
    }, { transaction })
    
    delete user.dataValues.password
    const accessToken = await createAccessToken(user)
    user.dataValues.token = accessToken

    return { user }
  }
}
