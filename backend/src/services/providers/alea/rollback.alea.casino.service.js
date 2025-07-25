
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { getCache } from '@src/libs/redis'
import { verifySignature } from '@src/services/helper/casino'
import { CreateLedgerHandlerHandler } from '@src/services/wallet'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/constants'
import { CASINO_TRANSACTION_PURPOSE, COINS, LEDGER_DIRECTIONS, LEDGER_TRANSACTION_TYPES, LEDGER_TYPES } from '@src/utils/constants/public.constants'
import { Op } from 'sequelize'


export class RollBackAleaCasinoHandler extends BaseHandler {
  async run() {
    const { id, casinoSessionId, currency, transaction } = this.args
    const dbTransaction = this.dbTransaction
    // const casinoTransactionModel = db.CasinoTransaction

    try {

      // checking signature
      if (!verifySignature(this.args)) {
        return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      }

      // Fetch session details from cache
      const payload = await getCache(casinoSessionId)

      if (!payload) return ALEA_ERROR_TYPES.GAME_SESSION_EXPIRE
      const { userId, coin, gameId } = JSON.parse(payload)

      // Validate user ID
      if (!+userId) return ALEA_ERROR_TYPES.PLAYER_NOT_FOUND

      // checking if playerId is valid or not
      if (this.args.player.casinoPlayerId !== `${userId}_${coin}`) {
        return ALEA_ERROR_TYPES.INVALID_CASINO_PLAYER_ID
      }

      // checking if gameId is valid or not
      if (this.args.game.id !== +gameId) return ALEA_ERROR_TYPES.GAME_NOT_FOUND

      if (this.args.currency !== coin) return ALEA_ERROR_TYPES.INVALID_CURRENCY

      const isGameCoin = currency === COINS.GOLD_COIN
      const walletFilterCoins = isGameCoin
        ? [COINS.GOLD_COIN]
        : [
          COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
          COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
          COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
        ]

      // Fetch wallets for the user with the specified currency codes
      const wallets = await db.Wallet.findAll({
        attributes: ['id', 'balance'],
        where: {
          userId, currencyCode: {
            [Op.in]: walletFilterCoins
          }
        },
        transaction: dbTransaction
      })

      // Calculate the real balance from the retrieved wallets
      const realBalance = wallets.reduce(
        (total, wallet) => total + (+wallet?.balance || 0),
        0)

      // Validate user ID
      if (!+userId) return ALEA_ERROR_TYPES.PLAYER_NOT_FOUND

      // Check if the transaction has already been processed
      const checkTransaction = await db.CasinoTransaction.findOne({
        attributes: ['id', 'transactionId', 'status', 'gameRoundId', 'casinoGameId'],
        where: { transactionId: `${id}:rollback` },
        transaction: dbTransaction
      })

      if (checkTransaction) {
        return {
          realBalance: realBalance,
          bonusBalance: 0.0,
          isAlreadyProcessed: true
        }
      }

      // Fetch existing rollback transactions
      const checkRollbackTransaction = await db.CasinoTransaction.findAll({
        attributes: ['id', 'transactionId', 'status', 'gameRoundId', 'casinoGameId'],
        where: { transactionId: { [Op.in]: [`${transaction.id}`, `${transaction.id}:bet`, `${transaction.id}:win`] } },
        include: {
          as: 'casinoLedger',
          model: db.TransactionLedger
        },
        transaction: dbTransaction
      })

      if (!checkRollbackTransaction.length) {
        // return ALEA_ERROR_TYPES.TRANSACTION_NOT_FOUND
        await db.CasinoTransaction.findOrCreate({
          where: {
            userId,
            casinoGameId: gameId,
            transactionId: `${id}:denied`
          },
          defaults: {
            userId,
            casinoGameId: gameId,
            transactionId: `${transaction.id}:denied`,
            moreDetails: this.args,
            actionType: CASINO_TRANSACTION_PURPOSE.GAME_ROLLBACK,
            status: CASINO_TRANSACTION_STATUS.SUCCESS,
          },
          transaction: dbTransaction
        })
        return {
          realBalance: realBalance,
          bonusBalance: 0.0,
          isNotFound: true
        }
      }

      // Process each rollback transaction
      for (const txn of checkRollbackTransaction) {
        const ledgers = txn.casinoLedger
        const [casinoTransaction] = await db.CasinoTransaction.findOrCreate({
          where: {
            userId,
            casinoGameId: gameId,
            transactionId: `${id}:rollback`
          },
          defaults: {
            userId,
            casinoGameId: gameId,
            transactionId: `${id}:rollback`,
            moreDetails: this.args,
            status: CASINO_TRANSACTION_STATUS.SUCCESS,
            actionType: CASINO_TRANSACTION_PURPOSE.GAME_ROLLBACK
          },
          transaction: dbTransaction
        })
        for (const ledger of ledgers) {
          await CreateLedgerHandlerHandler.execute({
            userId,
            amount: +ledger.amount,
            walletId: ledger.walletId,
            currencyCode: ledger.currencyCode,
            transactionId: casinoTransaction.id,
            transactionType: LEDGER_TRANSACTION_TYPES.CASINO,
            direction: ledger.direction === LEDGER_TYPES.DEBIT
              ? LEDGER_TYPES.CREDIT
              : LEDGER_TYPES.DEBIT
          }, this.context)
        }
      }

      // Fetch and calculate the updated balance

      // Fetch wallets for the user with the specified currency codes
      const updatedWallets = await db.Wallet.findAll({
        attributes: ['id', 'balance'],
        where: {
          userId, currencyCode: {
            [Op.in]: walletFilterCoins
          }
        },
        transaction: dbTransaction
      })

      // Calculate the real balance from the retrieved wallets
      const updatedBalance = updatedWallets.reduce(
        (total, wallet) => total + (+wallet?.balance || 0),
        0
      )
      // const updatedBalance = updatedWallets.reduce(
      //   (total, wallet) => MathPrecision.plus(total, wallet.balance),
      //   0
      // )

      // Commit the transaction
      return {
        realBalance: updatedBalance,
        bonusBalance: 0.0
      }
    } catch (error) {
      console.error('Error in Alea Play Rollback Handler', error)
      if (!transaction.finished) {
        await dbTransaction.rollback()
      }
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
