import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { createAccessToken } from '@src/helpers/authentication.helpers'
import { serverDayjs } from '@src/libs/dayjs'
import { BaseHandler } from '@src/libs/logicBase'
import { encryptPassword, getRequestIP } from '@src/utils/common'
import { USER_VIP_TIER_PROGRESS_KEYS, VIP_TIER } from '@src/utils/constants/constants'
import { CreateAffiliateuserHandler } from '../affiliate/commission.service'
import { AddUserTierProgressHandler } from '../userTierProgress'
import { TierHandlerHandler } from '../vipTier'

export class UserSignUpHandler extends BaseHandler {
  async run() {
    const {
      firstName,
      lastName,
      language,
      username,
      password,
      referralCode,
      signInType = 'NORMAL', // NORMAL | GOOGLE | FACEBOOK
      googleId,
      facebookId,
      email
    } = this.args

    const transaction = this.context.sequelizeTransaction
    let refParentId

    // check if user already exists by username, email, or sso ids
    const existingUser = await db.User.findOne({
      where: {
        ...(username ? { username } : {}),
        ...(email ? { email } : {}),
        ...(googleId ? { googleId } : {}),
        ...(facebookId ? { facebookId } : {})
      },
      transaction
    })
    if (existingUser) throw new AppError(Errors.USER_ALREADY_EXISTS)

    // create wallets for all currencies
    const currencies = await db.Currency.findAll({ attributes: ['code'] })
    const walletObjects = currencies.map(c => ({ currencyCode: c.code, balance: 0 }))

    // referral code
    if (referralCode) {
      const refUser = await db.User.findOne({
        where: { username: referralCode.split('_')[1] },
        attributes: ['userId'],
        transaction
      })
      refParentId = refUser?.userId
    }

    // password only for NORMAL signup
    const encryptedPassword = signInType === 'NORMAL' && password ? encryptPassword(password) : null


    const safeUsername = username 
    || (email ? email.split('@')[0] : null) 
    || `user_${Date.now()}`


    // create user
    const user = await db.User.create(
      {
        password: encryptedPassword,
        firstName,
        lastName,
        username: safeUsername,
        email,
        googleId,
        facebookId,
        signInType,
        isEmailVerified: signInType !== 'NORMAL',
        lastLoginDate: serverDayjs().utc().toDate(),
        refParentId,
        locale: language,
        userWallet: walletObjects
      },
      { include: { model: db.Wallet, as: 'userWallet' }, transaction }
    )

    // create UserDetails row
    const defaultTier = await db.VipTier.findOne({ where: { level: 1, isActive: true }, transaction })
    if (!defaultTier) throw new AppError(Errors.USER_VIP_TIER_NOT_FOUND)

    const nextTier = await db.VipTier.findOne({ where: { level: defaultTier.level + 1, isActive: true }, transaction })

    await db.UserDetails.create(
      {
        userId: user.userId,
        ipAddress: getRequestIP(this.context?.req) || null,
        vipTierId: defaultTier.vipTierId,
        nextVipTierId: nextTier?.vipTierId || defaultTier.vipTierId
      },
      { transaction }
    )

    // affiliate / referral
    if (referralCode && refParentId) {
      await CreateAffiliateuserHandler.execute(
        { referredUserId: user.userId, affiliateUserId: refParentId },
        this.context
      )

      await AddUserTierProgressHandler.execute(
        { userId: refParentId, referralsCount: USER_VIP_TIER_PROGRESS_KEYS.referralsCount },
        this.context
      )
    }

    // assign default tier
    await TierHandlerHandler.execute({ userId: user.userId, level: VIP_TIER.DEFAULT_TIER }, this.context)

    const existingLimit = await db.Limit.findOne({ where: { userId: user.userId }, transaction })
    if (!existingLimit) {
      await db.Limit.create({ userId: user.userId }, { transaction })
    }

    delete user.dataValues.password
    const accessToken = await createAccessToken(user)
    user.dataValues.token = accessToken

    return { user }
  }
}
