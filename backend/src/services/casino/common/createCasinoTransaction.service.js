import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { MathPrecision } from '@src/libs/mathOperation'
import { CreateLedgerHandlerHandler } from '@src/services/wallet'
import { AddUserTierProgressHandler } from '../../userTierProgress'
import { CASINO_TRANSACTION_PURPOSE, COINS, LEDGER_DIRECTIONS, LEDGER_TRANSACTION_TYPES } from '@src/utils/constants/public.constants'
import { Op } from 'sequelize'

export class CreateCasinoTransactionHandler extends BaseHandler {
  get constraints() {
    return transactionSchema
  }

  async run() {
    const {
      userId,
      amount,
      casinoGameId,
      currency,
      transactionId,
      gameRoundId,
      roundStatus,
      actionType,
      status,
      metaData,
    } = this.args
    console.log('*********************', userId)
    const transaction = this.dbTransaction
    const { CasinoTransaction, Wallet } = db

    const isGameCoin = currency === COINS.GOLD_COIN
    const walletFilterCoins = isGameCoin
      ? [COINS.GOLD_COIN]
      : [
        COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
        COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
        COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
      ]
    // Fetch wallets
    const wallets = await Wallet.findAll({
      where: {
        userId,
        currencyCode: { [Op.in]: walletFilterCoins },
      },
      lock: true,
      transaction,
    })

    // Calculate total balance
    const totalBalance = wallets.reduce(
      (total, wallet) => MathPrecision.plus(total, wallet.balance),
      0
    )

    if (actionType === CASINO_TRANSACTION_PURPOSE.CASINO_BET && totalBalance < amount) {
      throw new AppError(Errors.INSUFFICIENT_FUNDS)
    }

    // Create casino transaction
    const casinoTransaction = await CasinoTransaction.create(
      {
        userId,
        casinoGameId,
        transactionId,
        gameRoundId,
        roundStatus,
        actionType,
        metaData,
        status,
      },
      { transaction }
    )

    if (isGameCoin) {
      if (actionType === CASINO_TRANSACTION_PURPOSE.CASINO_BET) {
        await AddUserTierProgressHandler.execute({
          userId: userId,
          // wageringThreshold: amount,
          casinoGameId: casinoGameId,
        }, this.context)
      }
      await this.handleGameCoinTransaction({
        amount,
        wallet: wallets[0],
        actionType,
        casinoTransaction,
      })
    } else {
      if (actionType === CASINO_TRANSACTION_PURPOSE.CASINO_BET) {
        await AddUserTierProgressHandler.execute({
          userId: userId,
          wageringThreshold: amount,
          casinoGameId: casinoGameId,
        }, this.context)
      }
      await this.handleSweepCoinTransaction({
        wallets,
        amount,
        actionType,
        currency,
        casinoTransaction,
      })
    }

    // Fetch updated wallets and calculate updated balance
    const updatedWallets = await Wallet.findAll({ where: { userId, currencyCode: { [Op.in]: walletFilterCoins } }, transaction })
    const updatedBalance = updatedWallets.reduce(
      (total, wallet) => MathPrecision.plus(total, wallet.balance),
      0
    )

    return { casinoTransaction, updatedBalance }
  }

  async handleGameCoinTransaction({ amount, wallet, casinoTransaction, actionType }) {
    await CreateLedgerHandlerHandler.execute(
      {
        amount,
        walletId: wallet.id,
        direction: LEDGER_DIRECTIONS[actionType],
        userId: this.args.userId,
        transactionId: casinoTransaction.id,
        currencyCode: wallet.currencyCode,
        transactionType: LEDGER_TRANSACTION_TYPES.CASINO,
      },
      this.context
    )
  }

  async handleSweepCoinTransaction({ wallets, amount, actionType, currency, casinoTransaction }) {
    let remainingAmount = amount

    if (actionType === CASINO_TRANSACTION_PURPOSE.CASINO_BET) {
      const walletOrder = [
        COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
        COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
        COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
      ]

      for (const currencyCode of walletOrder) {
        const wallet = wallets.find((w) => w.currencyCode === currencyCode)
        if (wallet && remainingAmount > 0) {
          const deductionAmount = Math.min(remainingAmount, wallet.balance)
          if (deductionAmount > 0) {
            await CreateLedgerHandlerHandler.execute(
              {
                amount: deductionAmount,
                walletId: wallet.id,
                transactionType: LEDGER_TRANSACTION_TYPES.CASINO,
                userId: this.args.userId,
                direction: LEDGER_DIRECTIONS[actionType],
                transactionId: casinoTransaction.id,
                currencyCode: wallet.currencyCode,
              },
              this.context
            )
            remainingAmount = MathPrecision.minus(remainingAmount, deductionAmount)
          }
        }

        if (remainingAmount <= 0) break
      }
    }

    if (remainingAmount > 0 && (actionType === CASINO_TRANSACTION_PURPOSE.CASINO_WIN || actionType === CASINO_TRANSACTION_PURPOSE.CASINO_REFUND)) {
      const targetWalletCode = actionType === CASINO_TRANSACTION_PURPOSE.CASINO_REFUND ? currency : this.getTargetWalletCode(currency)
      const targetWallet = wallets.find((w) => w.currencyCode === targetWalletCode)

      if (targetWallet) {
        await CreateLedgerHandlerHandler.execute(
          {
            amount: remainingAmount,
            walletId: targetWallet.id,
            transactionType: LEDGER_TRANSACTION_TYPES.CASINO,
            userId: this.args.userId,
            direction: LEDGER_DIRECTIONS[actionType],
            transactionId: casinoTransaction.id,
            currencyCode: targetWallet.currencyCode,
          },
          this.context
        )
      }
    }
  }

  getTargetWalletCode(currency) {
    switch (currency) {
      case COINS.SWEEP_COIN.BONUS_SWEEP_COIN:
        return COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN
      case COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN:
        return COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN
      default:
        return COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN
    }
  }
}
