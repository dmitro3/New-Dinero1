import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { dayjs } from '@src/libs/dayjs'
import { BaseHandler } from '@src/libs/logicBase'
import { MathPrecision } from '@src/libs/mathOperation'
import { GLOBAL_SETTING } from '@src/utils/constant'
import { COINS, TRANSACTION_PURPOSE, LEDGER_TRANSACTION_TYPES } from '@src/utils/constants/public.constants'
import { SUCCESS_MSG } from '@src/utils/success'
import { Op } from 'sequelize'

export class GetFaucetHandler extends BaseHandler {
  async run () {
    const { userId, currencyCode } = this.args
    const transaction = this.dbTransaction
    const coinCode = currencyCode === COINS.GOLD_COIN ? COINS.GOLD_COIN : COINS.SWEEP_COIN.BONUS_SWEEP_COIN
    const walletFilterCoins = currencyCode === COINS.GOLD_COIN
      ? [COINS.GOLD_COIN]
      : [
          COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
          COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
          COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN
        ]

    // Fetch the user's details and wallet balance
    const user = await db.User.findOne({
      where: { userId },
      attributes: ['createdAt'],
      include: [
        {
          model: db.Wallet,
          as: 'userWallet',
          attributes: ['balance'],
          where: { currencyCode: { [Op.in]: walletFilterCoins } }
        }
      ],
      transaction
    })
    if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
    const wallets = user.userWallet

    // Calculate total balance
    const totalBalance = wallets.reduce(
      (total, wallet) => MathPrecision.plus(total, wallet.balance),
      0
    )
    // Check if the user was created less than 5 minutes ago
    const timeSinceCreation = dayjs().diff(dayjs(user.createdAt))
    if (timeSinceCreation < 5 * 60000) {
      return {
        isAvailable: false,
        timeRemainingForNextFaucet: ((5 * 60000) - timeSinceCreation),
        message: 'User must wait at least 5 minutes after account creation to claim the faucet.'
      }
    }

    if (totalBalance > 0) throw new AppError(Errors.BALANCE_MUST_BE_ZERO)

    const lastFaucetAwail = await db.Transaction.findOne({
      where: { userId, purpose: TRANSACTION_PURPOSE.FAUCET_AWAIL },
      attributes: ['createdAt', 'transactionId'],
      include: [
        {
          model: db.TransactionLedger,
          as: 'bankingLedger',
          attributes: ['currency_code'],
          required: true,
          where: {
            transaction_type: LEDGER_TRANSACTION_TYPES.BANKING,
            currency_code: { [Op.eq]: coinCode }
          },
          on: {
            transactionId: db.sequelize.where(
              //       currencyCode: coinCode,
              db.sequelize.col('bankingLedger.transaction_id'),
              '=',
              db.sequelize.col('Transaction.transaction_id')
            )
          }
        }
      ],
      order: [['createdAt', 'DESC']],
      transaction
    })

    // Fetch faucet settings
    const faucet = await db.GlobalSetting.findOne({
      where: { key: GLOBAL_SETTING.FAUCET_SETTING },
      transaction
    })

    if (!faucet) {
      throw new AppError(Errors.FAUCET_SETTING_NOT_FOUND) // Handle missing faucet settings
    }

    // Check if the user has already availed of the faucet recently
    if (lastFaucetAwail) {
      const timeDifference = dayjs().diff(dayjs(lastFaucetAwail.createdAt))
      if (timeDifference < (faucet.value.interval * 60000)) {
        return {
          isAvailable: false,
          timeRemainingForNextFaucet: (faucet.value.interval * 60000) - timeDifference,
          message: SUCCESS_MSG.GET_SUCCESS
        }
      }
    }

    // Allow faucet claim
    return {
      isAvailable: true,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
