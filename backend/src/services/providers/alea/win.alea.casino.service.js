import { BaseHandler } from '@src/libs/logicBase'
import { MathPrecision } from '@src/libs/mathOperation'
import { getCache } from '@src/libs/redis'
import { CreateCasinoTransactionHandler } from '@src/services/casino/common/createCasinoTransaction.service'
import { TRANSACTION_STATUS } from '@src/utils/constant'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { CASINO_TRANSACTION_PURPOSE, COINS } from '@src/utils/constants/public.constants'
import { SendRecentBigWinHandler } from '@src/services/leaderBoard/sendRecentBigWinHandler'
// import { CreateCasinoTransactionHandler } from '../../common/createCasinoTransaction.service'
import db from '@src/db/models'
import { verifySignature } from '@src/services/helper/casino'
import { Op } from 'sequelize'

export class WinAleaCasinoHandler extends BaseHandler {
  async run() {
    const { amount, currency, id, casinoSessionId, round } = this.args

    const transaction = this.dbTransaction
    const isGameCoin = currency === COINS.GOLD_COIN
    const walletFilterCoins = isGameCoin
      ? [COINS.GOLD_COIN]
      : [
        COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
        COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
        COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
      ]

    try {
      if (+amount < 0) return ALEA_ERROR_TYPES.UNKNOWN_ERROR
      // checking signature
      if (!verifySignature(this.args)) {
        return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      }
      const payload = await getCache(casinoSessionId)
      if (!payload) return ALEA_ERROR_TYPES.GAME_SESSION_EXPIRE
      const { userId, coin, gameId, providerCasinoGameId } = JSON.parse(payload)

      // checking if gameId is valid or not
      if (this.args.game.id !== +providerCasinoGameId) {
        return ALEA_ERROR_TYPES.GAME_NOT_FOUND
      }

      // checking if playerId is valid or not
      if (this.args.player.casinoPlayerId !== `${userId}_${coin}`) {
        return ALEA_ERROR_TYPES.INVALID_CASINO_PLAYER_ID
      }

      if (currency !== coin) return ALEA_ERROR_TYPES.INVALID_CURRENCY

      if (!+userId) return ALEA_ERROR_TYPES.PLAYER_NOT_FOUND

      const checkTransaction = await db.CasinoTransaction.findOne({
        where: {
          userId,
          gameRoundId: round.id
        },
        attributes: ['transactionId'],
        transaction
      })

      if (!checkTransaction) {
        return ALEA_ERROR_TYPES.UNKNOWN_ERROR
      }

      const checkWinTransaction = await db.CasinoTransaction.findOne({
        where: {
          transactionId: `${id}:win`,
          gameRoundId: round.id
        },
        attributes: ['transactionId'],
        transaction
      })

      if (checkWinTransaction) {
        // const walletFilterCoins= coin === "GC" ? [COINS.GOLD_COIN]
        // : [
        //   COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
        //   COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
        //   COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
        // ]

        const userWallet = await db.Wallet.findAll({
          attributes: ['id', 'balance'],
          where: {
            userId, currencyCode: {
              [Op.in]: walletFilterCoins
            }
          },
          lock: true,
          transaction
        })

        // Calculate the real balance from the retrieved wallets
        const updatedBalance = userWallet.reduce(
          (total, wallet) => total + (+wallet?.balance || 0),
          0
        )

        return {
          // statusCode: 200,
          realBalance: updatedBalance,
          bonusBalance: 0,
          realAmount: amount,
          bonusAmount: 0.0,
          isAlreadyProcessed: true
        }
      }

      else {
        if (checkTransaction.transactionId === id) {
          const userWallet = await db.Wallet.findOne({
            where: {
              userId,
              currencyCode: { [Op.in]: walletFilterCoins },
            },
            lock: true,
            transaction
          })
          const updatedBalance = userWallet.reduce((total, wallet) => MathPrecision.plus(total, wallet.balance), 0)

          return {
            statusCode: 200,
            realBalance: updatedBalance,
            bonusBalance: 0,
            realAmount: 100,
            bonusAmount: 0.0,
            isAlreadyProcessed: true
          }
        }
      }

      const result = await CreateCasinoTransactionHandler.execute({
        userId,
        amount,
        casinoGameId: gameId,
        currency: coin,
        transactionId: `${id}:win`,
        gameRoundId: round.id,
        roundStatus: round.status,
        actionType: CASINO_TRANSACTION_PURPOSE.CASINO_WIN,
        status: TRANSACTION_STATUS.SUCCESS,
        metaData: this.args
      }, this.context)

      if (coin !== COINS.GOLD_COIN && amount > 0) {

        SendRecentBigWinHandler.execute({ userId, roundId: round.id, amount, gameId })

      }

      return {
        id: result.casinoTransaction.id,
        realBalance: result.updatedBalance,
        bonusBalance: 0.0,
        realAmount: amount,
        bonusAmount: 0.0
      }

    } catch (error) {
      console.log('Error in Alea Play Win Transaction', error)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
