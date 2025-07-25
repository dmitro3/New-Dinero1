import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { getCache } from '@src/libs/redis'
import { verifySignature } from '@src/services/helper/casino'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { COINS } from '@src/utils/constants/public.constants'
import { Op } from 'sequelize'

export class GetBalanceAleaCasinoHandler extends BaseHandler {
  async run() {
    const { casinoSessionId } = this.args;

    try {

      // checking signature
      if (!verifySignature(this.args)) {
        return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      }

      // Retrieve cached payload
      const payload = await getCache(casinoSessionId)

      // Ensure payload is valid
      if (!payload) return ALEA_ERROR_TYPES.GAME_SESSION_EXPIRE

      const { userId, coin, gameId } = JSON.parse(payload)

      // checking if playerId is valid or not
      if (this.args?.playerId !== `${userId}_${coin}`) {
        return ALEA_ERROR_TYPES.INVALID_CASINO_PLAYER_ID
      }

      if (this.args?.currency !== coin) return ALEA_ERROR_TYPES.INVALID_CURRENCY

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

      // Return the calculated balance
      return {
        realBalance,
        bonusBalance: 0.0, // Assuming no bonus balance logic here
      }
    } catch (error) {
      console.error('Error in Alea Balance call service:', {
        casinoSessionId,
        errorMessage: error.message,
        stack: error.stack,
      })
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
