import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { getCache } from '@src/libs/redis'
import { CreateCasinoTransactionHandler } from '@src/services/casino/common/createCasinoTransaction.service'
import { verifySignature } from '@src/services/helper/casino'
import { TRANSACTION_STATUS } from '@src/utils/constant'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { CASINO_TRANSACTION_PURPOSE, COINS } from '@src/utils/constants/public.constants'
import { Op } from 'sequelize'


export class BetAleaCasinoHandler extends BaseHandler {
  async run() {
    const { id, player, casinoSessionId, round, amount, currency } = this.args
    const transaction = this.context.sequelizeTransaction

    // checking signature
    if (!verifySignature(this.args)) {
      return ALEA_ERROR_TYPES.INVALID_SIGNATURE
    }

    const payload = await getCache(casinoSessionId)
    if (!payload) return ALEA_ERROR_TYPES.GAME_SESSION_EXPIRE

    const { userId, coin, gameId, providerCasinoGameId } = JSON.parse(payload)
    // checking if gameId is valid or not
    if (this.args.game.id !== +providerCasinoGameId) return ALEA_ERROR_TYPES.GAME_NOT_ALLOWED

    // checking if playerId is valid or not
    if (this.args.player.casinoPlayerId !== `${userId}_${coin}`) {
      return ALEA_ERROR_TYPES.INVALID_CASINO_PLAYER_ID
    }

    if (currency !== coin)
      return ALEA_ERROR_TYPES.INVALID_CURRENCY

    // Determine the relevant currency codes based on the coin type
    const currencyCodes =
      coin === COINS.GOLD_COIN
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
          [Op.in]: currencyCodes
        }
      }
    })

    // Calculate the real balance from the retrieved wallets
    const realBalance = wallets.reduce(
      (total, wallet) => total + (+wallet?.balance || 0),
      0
    )

    if (+amount < 0) return ALEA_ERROR_TYPES.TRANSACTION_ALREADY_PROCESSED

    if (+amount > realBalance) return ALEA_ERROR_TYPES.INSUFFICIENT_FUNDS

    const gotDeniedBefore = await db.CasinoTransaction.findOne({
      where: { transactionId: `${id}:denied` },
      attributes: ['transactionId'],
      transaction
    })

    if (gotDeniedBefore) return ALEA_ERROR_TYPES.BET_DENIED

    const gotRollbackBefore = await db.CasinoTransaction.findOne({
      where: { transactionId: `${id}:bet` },
      attributes: ['transactionId', 'status'],
      transaction
    })

    // if (gotRollbackBefore) return ALEA_ERROR_TYPES.BET_DENIED

    if (gotRollbackBefore && gotRollbackBefore.status === TRANSACTION_STATUS.CANCELLED) {
      return ALEA_ERROR_TYPES.BET_DENIED
    }
    if (gotRollbackBefore && gotRollbackBefore.status !== TRANSACTION_STATUS.FAILED) {
      return {
        // id: result.casinoTransaction.id,
        realBalance: realBalance,
        bonusBalance: 0.0,
        realAmount: amount,
        bonusAmount: 0.0,
        isAlreadyProcessed: true
      }
    }


    // if (!userId) {
    //   return ALEA_ERROR_TYPES.SESSION_EXPIRED
    // }

    // if (currency !== coin) return ALEA_ERROR_TYPES.INVALID_CURRENCY

    const result = await CreateCasinoTransactionHandler.execute({
      userId,
      amount,
      casinoGameId: gameId,
      currency: coin,
      transactionId: `${id}:bet`,
      gameRoundId: round.id,
      roundStatus: round.status,
      actionType: CASINO_TRANSACTION_PURPOSE.CASINO_BET,
      // status: TRANSACTION_STATUS.SUCCESS,
      metaData: this.args
    }, this.context)

    return {
      id: result.casinoTransaction.id,
      realBalance: result.updatedBalance,
      bonusBalance: 0.0,
      realAmount: amount,
      bonusAmount: 0.0
    }
  }
}
