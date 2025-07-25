
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { MathPrecision } from '@src/libs/mathOperation'
import { getCache } from '@src/libs/redis'
import { CreateCasinoTransactionHandler } from '@src/services/casino/common/createCasinoTransaction.service'
import { verifySignature } from '@src/services/helper/casino'
import { TRANSACTION_STATUS } from '@src/utils/constant'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { CASINO_TRANSACTION_PURPOSE, COINS } from '@src/utils/constants/public.constants'
import { Op } from 'sequelize'
// import { CreateCasinoTransactionHandler } from '../../common/createCasinoTransaction.service'

export class BetAndWinAleaCasinoHandler extends BaseHandler {
  async run() {
    const id = this.args.id
    const casinoSessionId = this.args.casinoSessionId
    const bet = this.args.bet
    const win = this.args.win
    const round = this.args.round
    const currency = this.args.currency

    const isGameCoin = currency === COINS.GOLD_COIN
    const walletFilterCoins = isGameCoin
      ? [COINS.GOLD_COIN]
      : [
        COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
        COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
        COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
      ]

    const transaction = this.dbTransaction
    const betAmount = bet.amount
    const winAmount = win.amount
    try {
      if (+betAmount < 0) return ALEA_ERROR_TYPES.BET_DENIED

      // checking signature
      if (!verifySignature(this.args)) {
        return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      }

      const payload = await getCache(casinoSessionId)

      if (!payload) return ALEA_ERROR_TYPES.GAME_SESSION_EXPIRE

      const { userId, coin, gameId, providerCasinoGameId } = JSON.parse(payload)

      // checking if playerId is valid or not
      if (this.args.player.casinoPlayerId !== `${userId}_${coin}`) {
        return ALEA_ERROR_TYPES.INVALID_CASINO_PLAYER_ID
      }

      // checking if gameId is valid or not
      if (this.args.game.id !== +providerCasinoGameId) return ALEA_ERROR_TYPES.GAME_NOT_ALLOWED

      // check of invalid currency case
      if (currency !== coin) return ALEA_ERROR_TYPES.INVALID_CURRENCY

      if (!userId) return ALEA_ERROR_TYPES.GAME_SESSION_EXPIRE

      // Fetch wallets for the user with the specified currency codes
      const wallets = await db.Wallet.findAll({
        attributes: ['id', 'balance'],
        where: {
          userId, currencyCode: {
            [Op.in]: walletFilterCoins
          }
        }
      })

      // Calculate the real balance from the retrieved wallets
      const realBalance = wallets.reduce(
        (total, wallet) => total + (+wallet?.balance || 0),
        0
      )

      const checkTransaction = await db.CasinoTransaction.findOne({
        attributes: ['transactionId', 'gameRoundId'],
        where: {
          transactionId: `${id}:bet`,
          // { roundId: round.id }
        },
        transaction
      })

      if (checkTransaction) {
        await transaction.commit()
        return {
          realBalance: realBalance,
          bonusBalance: 0.00,
          bet: {
            realAmount: betAmount,
            bonusAmount: 0.00
          },
          win: {
            realAmount: winAmount,
            bonusAmount: 0.00
          },
          isAlreadyProcessed: true
        }
      }

      if (+betAmount > realBalance) return ALEA_ERROR_TYPES.INSUFFICIENT_FUNDS

      // if (checkTransaction?.gameRoundId === round.id) {
      //   return ALEA_ERROR_TYPES.BET_DENIED
      // }

      const betResult = await CreateCasinoTransactionHandler.execute({
        userId,
        amount: betAmount,
        casinoGameId: gameId,
        currency: coin,
        transactionId: `${id}:bet`,
        gameRoundId: round.id,
        roundStatus: round.status,
        actionType: CASINO_TRANSACTION_PURPOSE.CASINO_BET,
        status: TRANSACTION_STATUS.SUCCESS,
        metaData: this.args
      }, this.context)


      const winResult = await CreateCasinoTransactionHandler.execute({
        userId,
        amount: winAmount,
        casinoGameId: gameId,
        currency: coin,
        transactionId: `${id}:win`,
        gameRoundId: round.id,
        roundStatus: round.status,
        actionType: CASINO_TRANSACTION_PURPOSE.CASINO_WIN,
        status: TRANSACTION_STATUS.SUCCESS,
        metaData: this.args
      }, this.context)

      return {
        realBalance: winResult.updatedBalance,
        bonusBalance: 0.0,
        bet: {
          realAmount: betAmount,
          bonusAmount: 0.0
        },
        win: {
          realAmount: winAmount,
          bonusAmount: 0.0
        }
      }
    } catch (error) {
      console.log('Error in Bet and Win Alea Play', error)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
