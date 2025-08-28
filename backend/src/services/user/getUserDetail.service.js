import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { CASINO_TRANSACTION_PURPOSE, COINS } from "@src/utils/constants/public.constants";

export class GetUserDetailsHandler extends BaseHandler {
  async run () {
    const userId = this.args.userId
    const { currencyCode = 'BSC' } = this.args

    const user = await db.User.findOne({
      where: { userId },
      attributes: ['userId', 'username', 'email','isEmailVerified', 'city', 'firstName', 'lastName', 'createdAt', 'dateOfBirth', 'profileImage', 'veriffStatus', 'isActive'],
      include: [
        {
          model: db.Wallet,
          as: 'userWallet',
          attributes: ['balance', 'currencyCode']
        },
        {
          model: db.UserDetails,
          as: 'userDetails',
          attributes: ['ipAddress', 'vipTierId', 'nextVipTierId', 'coinflowKycStatus', 'address', 'zip'], // Include nextVipTierId here
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
        },
        {
          model: db.State,
          attributes: ['name', 'stateCode'],
          required: false
        },
        {
          model: db.Limit,
          as: 'userLimits',
          required: false
        }
      ]
    })

    if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
    if (!user.isActive) throw new AppError(Errors.USER_ACCOUNT_INACTIVE)

    const currentVipTier = user.userDetails ? user.userDetails.VipTier : null
    const nextVipTier = user.userDetails ? user.userDetails.nextVipTier : null
    const userTierProgress = user?.userTierProgresses || []

    if (!currentVipTier) throw new AppError(Errors.USER_VIP_TIER_NOT_FOUND)

    delete user.dataValues.password
    delete user.dataValues.userDetails.dataValues.nextVipTier
    delete user.dataValues.userDetails?.dataValues?.VipTier
    delete user.dataValues.userTierProgresses
    delete user.dataValues.lastLoginDate

    let whereCondition = {}
    if (currencyCode === COINS.GOLD_COIN) {
      whereCondition = { currencyCode: COINS.GOLD_COIN };
    } else if (currencyCode === COINS.SWEEP_COIN.BONUS_SWEEP_COIN) {
      whereCondition = {
        currencyCode: {
          [db.Sequelize.Op.in]:
            [
              COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
              COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
              COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN
            ]
        }
      };
    } else {

      whereCondition = {
        currencyCode: {
          [db.Sequelize.Op.in]:
            [
              COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
              COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
              COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN
            ]
        }
      };
    }

    const transactionAmounts = await db.CasinoTransaction.findAll({
      attributes: [
        [db.sequelize.col('casinoLedger.amount'), 'totalAmount'],
        [db.sequelize.col('action_type'), 'actionType'],
        [db.sequelize.col('casinoLedger.currency_code'), 'currencyCode']
      ],
      include: [
        {
          model: db.TransactionLedger,
          as: 'casinoLedger',
        }
      ],
      where: {
        userId: user.userId,
        actionType: [
          CASINO_TRANSACTION_PURPOSE.CASINO_BET,
          CASINO_TRANSACTION_PURPOSE.CASINO_WIN
        ],
        '$casinoLedger.currency_code$': whereCondition.currencyCode,
      },
      //group: ['CasinoTransaction.id', 'CasinoTransaction.action_type', 'casinoLedger.ledger_id', 'casinoLedger.currency_code'],
    });

    let totalBetAmount = 0;
    let totalBetCount = 0;

    for (const tx of transactionAmounts) {
      if (tx.dataValues.actionType === CASINO_TRANSACTION_PURPOSE.CASINO_BET) {
        totalBetAmount += parseFloat(tx.dataValues.totalAmount || 0);
        totalBetCount += 1;
      }
    }

    const totalWinAmount = transactionAmounts
      .filter(tx => tx.dataValues.actionType === CASINO_TRANSACTION_PURPOSE.CASINO_WIN)
      .reduce((acc, tx) => acc + parseFloat(tx.dataValues.totalAmount || 0), 0);

    const losses = Math.max(totalBetAmount - totalWinAmount, 0);


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

    // Prepare response with current and next VIP tier information and rewards
    const response = {
      ...user.dataValues,
      isEmailVerified: user.isEmailVerified,
      losses: losses,
      win: totalWinAmount,
      wagered: totalBetAmount,
      betCount: totalBetCount,
      currentVipTier: {
        vipTierId: currentVipTier.vipTierId,
        name: currentVipTier.name,
        icon: currentVipTier.icon,
        level: currentVipTier.level,
        rewards: currentVipTier.rewards || []
      },
      nextVipTier: nextVipTier || null,
      userTierProgress: userTierProgress || []
    }

    return response
  }
}
