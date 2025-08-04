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
    const { username, password } = this.args
    const transaction = await this.context.sequelizeTransaction

    const user = await db.User.findOne({
      where: { username },
      attributes: ['userId', 'username', 'firstName', 'lastName', 'password', 'createdAt', 'lastLoginDate', 'isActive'],
      include: [
        {
          model: db.User,
          as: 'referrer', // Parent User
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
          attributes: ['ipAddress', 'vipTierId', 'nextVipTierId', 'id'], // Include nextVipTierId here
          include: [
            {
              model: db.VipTier,
              as: 'VipTier',
              attributes: ['vipTierId', 'name', 'icon', 'level'],
              include: [
                {
                  model: db.Reward,
                  as: 'rewards',
                  attributes: { exclude: ['createdAt', 'updatedAt'] }
                }
              ]
            },
            {
              model: db.VipTier,
              as: 'nextVipTier',
              // attributes: ['vipTierId', 'name', 'icon', 'level'],  // Include nextVipTier
              include: [
                {
                  model: db.Reward,
                  as: 'rewards',
                  attributes: { exclude: ['createdAt', 'updatedAt'] }
                }
              ]
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
    if (!await comparePassword(password, user.password)) throw new AppError(Errors.WRONG_PASSWORD_ERROR)

    const currentVipTier = user.userDetails ? user.userDetails.VipTier : null
    const nextVipTier = user.userDetails ? user.userDetails.nextVipTier : null
    const userTierProgress = user?.userTierProgresses || []
    await user.userDetails.set({ loginIpAddress: getRequestIP(this.context.req) }).save({ transaction })
    if (!currentVipTier) throw new AppError(Errors.USER_VIP_TIER_NOT_FOUND)
    // Create access token
    const accessToken = await createAccessToken(user)

    // Compare last login date to today's date (UTC)
    const lastLoginDate = user.dataValues?.lastLoginDate ? dayjs(user.dataValues.lastLoginDate).utc().startOf('day') : null
    const today = serverDayjs().startOf('day')
    let isNewLoginDay = false
    if (!lastLoginDate || !lastLoginDate.isSame(today, 'day')) {
      // If last login date is not today, set `isNewLoginDay` to true and update the login date
      isNewLoginDay = true
    }
    // Update last login date to the current UTC date
    await db.User.update({ lastLoginDate: serverDayjs().utc().toDate() }, // Set the current UTC time
      { where: { userId: user.userId } }, transaction)

    if (isNewLoginDay || !userTierProgress.length) {
      await AddUserTierProgressHandler.execute({
        userId: user?.userId,
        loginStreak: USER_VIP_TIER_PROGRESS_KEYS.loginStreak
      }, this.context)

      if (userTierProgress && userTierProgress.length > 0) {
        userTierProgress[0].loginStreak = userTierProgress[0]?.loginStreak + 1
      }
    }

    delete user.dataValues.password
    delete user.dataValues.userDetails.dataValues.nextVipTier
    delete user.dataValues.userDetails.dataValues.VipTier
    delete user.dataValues.userTierProgresses
    // delete user.dataValues.nextVipTier
    delete user.dataValues.lastLoginDate

    if (userTierProgress.length === 0) {
      userTierProgress.push({
        wageringThreshold: 0,
        gamesPlayed: 0,
        bigBetsThreshold: 0,
        depositsThreshold: 0,
        loginStreak: 0,
        referralsCount: 0,
        // sweepstakesEntries: 0,
        // sweepstakesWins: 0,
        // timeBasedConsistency: 0,
        isActive: true
      })
    }
    // Prepare response with current and next VIP tier information and rewards
    const response = {
      user: {
        ...user.dataValues,
        currentVipTier: currentVipTier ? {
          vipTierId: currentVipTier.vipTierId,
          name: currentVipTier.name,
          icon: currentVipTier.icon,
          level: currentVipTier.level,
          rewards: currentVipTier.rewards || []
        } : null,
        nextVipTier: nextVipTier || null,
        userTierProgress: userTierProgress || []

      },
      accessToken
    }

    return response
  }
}
