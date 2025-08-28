import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { createAccessToken } from '@src/helpers/authentication.helpers'
import { dayjs, serverDayjs } from '@src/libs/dayjs'
import { BaseHandler } from '@src/libs/logicBase'
import { comparePassword, getRequestIP } from '@src/utils/common'
import { USER_VIP_TIER_PROGRESS_KEYS } from '@src/utils/constants/constants'
import { AddUserTierProgressHandler } from '../userTierProgress'

export class UserLoginHandler extends BaseHandler {
  async run() {
    const { username, password, email, signInType = 'NORMAL', googleId, facebookId } = this.args
    const transaction = await this.context.sequelizeTransaction

    // Build where condition dynamically
    let whereCondition = {}
    if (signInType === 'NORMAL') {
      if (!username) throw new AppError(Errors.USER_NOT_EXISTS)
      whereCondition.username = username
    } else if (signInType === 'GOOGLE') {
      if (!googleId && !email) throw new AppError(Errors.USER_NOT_EXISTS)
      if (googleId) whereCondition.googleId = googleId
      else whereCondition.email = email
    } else if (signInType === 'FACEBOOK') {
      if (!facebookId && !email) throw new AppError(Errors.USER_NOT_EXISTS)
      if (facebookId) whereCondition.facebookId = facebookId
      else whereCondition.email = email
    }

    const user = await db.User.findOne({
      where: whereCondition,
      attributes: [
        'userId',
        'username',
        'firstName',
        'lastName',
        'password',
        'createdAt',
        'lastLoginDate',
        'isActive'
      ],
      include: [
        {
          model: db.User,
          as: 'referrer',
          attributes: ['userId', 'username', 'firstName', 'lastName']
        },
        {
          model: db.Wallet,
          as: 'userWallet',
          attributes: ['balance', 'currencyCode']
        },
        {
          model: db.UserDetails,
          as: 'userDetails',
          attributes: ['ipAddress', 'vipTierId', 'nextVipTierId', 'id'],
          include: [
            {
              model: db.VipTier,
              as: 'VipTier',
              attributes: ['vipTierId', 'name', 'icon', 'level'],
              include: [{ model: db.Reward, as: 'rewards', attributes: { exclude: ['createdAt', 'updatedAt'] } }]
            },
            {
              model: db.VipTier,
              as: 'nextVipTier',
              include: [{ model: db.Reward, as: 'rewards', attributes: { exclude: ['createdAt', 'updatedAt'] } }]
            }
          ]
        },
        {
          model: db.UserTierProgress,
          as: 'userTierProgresses',
          attributes: { exclude: ['updatedAt'] },
          where: { isActive: true },
          required: false
        }
      ]
    }, transaction)

    if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
    if (!user.isActive) throw new AppError(Errors.USER_ACCOUNT_INACTIVE)

    // password check only for NORMAL login
    if (signInType === 'NORMAL') {
      if (!(await comparePassword(password, user.password))) {
        throw new AppError(Errors.WRONG_PASSWORD_ERROR)
      }
    }

    // Ensure userDetails exists
    if (!user.userDetails) {
      const defaultTier = await db.VipTier.findOne({ where: { level: 1, isActive: true }, transaction })
      if (!defaultTier) throw new AppError(Errors.USER_VIP_TIER_NOT_FOUND)

      const nextTier = await db.VipTier.findOne({ where: { level: defaultTier.level + 1, isActive: true }, transaction })

      user.userDetails = await db.UserDetails.create(
        {
          userId: user.userId,
          ipAddress: getRequestIP(this.context?.req) || null,
          vipTierId: defaultTier.vipTierId,
          nextVipTierId: nextTier?.vipTierId || defaultTier.vipTierId
        },
        { transaction }
      )
    } else {
      await user.userDetails.set({ loginIpAddress: getRequestIP(this.context.req) }).save({ transaction })
    }

    const currentVipTier = user.userDetails?.VipTier
    const nextVipTier = user.userDetails?.nextVipTier
    const userTierProgress = user?.userTierProgresses || []

    if (!currentVipTier) throw new AppError(Errors.USER_VIP_TIER_NOT_FOUND)

    if (!user.username) {
      user.username = user.email || `user_${user.userId}`
    }
    // Create access token
    const accessToken = await createAccessToken(user)

    // Handle daily login streak
    const lastLoginDate = user.dataValues?.lastLoginDate
      ? dayjs(user.dataValues.lastLoginDate).utc().startOf('day')
      : null
    const today = serverDayjs().startOf('day')
    let isNewLoginDay = !lastLoginDate || !lastLoginDate.isSame(today, 'day')

    await db.User.update(
      { lastLoginDate: serverDayjs().utc().toDate() },
      { where: { userId: user.userId } },
      transaction
    )

    if (isNewLoginDay || !userTierProgress.length) {
      await AddUserTierProgressHandler.execute(
        { userId: user.userId, loginStreak: USER_VIP_TIER_PROGRESS_KEYS.loginStreak },
        this.context
      )

      if (userTierProgress.length > 0) {
        userTierProgress[0].loginStreak = userTierProgress[0].loginStreak + 1
      }
    }

    // Cleanup sensitive/extra fields
    delete user.dataValues.password
    delete user.dataValues.userDetails.dataValues.nextVipTier
    delete user.dataValues.userDetails.dataValues.VipTier
    delete user.dataValues.userTierProgresses
    delete user.dataValues.lastLoginDate

    if (userTierProgress.length === 0) {
      userTierProgress.push({
        wageringThreshold: 0,
        gamesPlayed: 0,
        bigBetsThreshold: 0,
        depositsThreshold: 0,
        loginStreak: 0,
        referralsCount: 0,
        isActive: true
      })
    }

    return {
      user: {
        ...user.dataValues,
        currentVipTier: currentVipTier
          ? {
            vipTierId: currentVipTier.vipTierId,
            name: currentVipTier.name,
            icon: currentVipTier.icon,
            level: currentVipTier.level,
            rewards: currentVipTier.rewards || []
          }
          : null,
        nextVipTier: nextVipTier || null,
        userTierProgress: userTierProgress || []
      },
      accessToken
    }
  }
}
