import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { getCache } from '@src/libs/redis'
import { COINS } from '@src/utils/constants/public.constants'
import { Op } from 'sequelize'
import { ONE_GAME_HUB_CURRENCY_MAPPER, OneGameHubError } from '@src/utils/constants/casinoProviders/oneGameHub.constants'


export class GetBalanceOneGameHubCasinoHandler extends BaseHandler {
  async run() {

    try {
      const { currency, player_id } = this.args

      const transaction = this.context.sequelizeTransaction

      const payload = await getCache(player_id)
      if (!payload) return OneGameHubError.sessionTimeoutError

      const { userId, coin } = JSON.parse(payload)

      if (ONE_GAME_HUB_CURRENCY_MAPPER[currency] !== coin) return OneGameHubError.unsupportedCurrencyError

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
        },
        transaction
      })

      // Calculate the real balance from the retrieved wallets
      const realBalance = wallets.reduce(
        (total, wallet) => total + (+wallet?.balance || 0),
        0
      )

      await transaction.commit();

      // Return the calculated balance
      return {
        status: 200,
        balance: realBalance,
        currency: currency
      }
    } catch (error) {
      console.error('Error in one game hub Balance call service:', {
        errorMessage: error.message,
        stack: error.stack,
      })
      return OneGameHubError.unknownError
    }
  }
}
