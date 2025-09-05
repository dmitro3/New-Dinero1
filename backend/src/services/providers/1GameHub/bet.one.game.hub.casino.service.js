import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { getCache } from '@src/libs/redis'
import { CreateCasinoTransactionHandler } from '@src/services/casino/common/createCasinoTransaction.service'
import { verifySignature } from '@src/services/helper/casino'
import { TRANSACTION_STATUS } from '@src/utils/constant'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { ONE_GAME_HUB_CURRENCY_MAPPER, OneGameHubError } from '@src/utils/constants/casinoProviders/oneGameHub.constants'
import { CASINO_TRANSACTION_PURPOSE, COINS } from '@src/utils/constants/public.constants'
import { Op } from 'sequelize'
import querystring from 'querystring'


export class BetOneGameHubCasinoHandler extends BaseHandler {
  async run() {
    const transaction = this.context.sequelizeTransaction;

    try {
      const { transaction_id, currency, game_id, round_id, ext_round_id, ext_round_finished, player_id, amount } = this.args;

      const payload = await getCache(player_id);
      if (!payload) return OneGameHubError.sessionTimeoutError;

      const { userId, coin, gameId } = JSON.parse(payload);

      if (ONE_GAME_HUB_CURRENCY_MAPPER[currency] !== coin) return OneGameHubError.unsupportedCurrencyError;

      // Determine the relevant currency codes based on the coin type
      const currencyCodes =
        coin === COINS.GOLD_COIN
          ? [COINS.GOLD_COIN]
          : [
            COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
            COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
            COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
          ];
      // Fetch wallets for the user with the specified currency codes
      const wallets = await db.Wallet.findAll({
        attributes: ['id', 'balance'],
        where: {
          userId,
          currencyCode: {
            [Op.in]: currencyCodes
          }
        },
        transaction
      });
      // Calculate the real balance from the retrieved wallets
      const realBalance = Number(wallets.reduce(
        (total, wallet) => total + (+wallet?.balance || 0),
        0
      ));
      if (+amount > realBalance) {
        return {
          status: 400,
          error: 'Insufficient funds',
          message: 'User does not have enough balance to place this bet.'
        };
      }
      const gotDeniedBefore = await db.CasinoTransaction.findOne({
        where: { transactionId: `${transaction_id}:cancel` },
        attributes: ['transactionId'],
        transaction
      });

      if (gotDeniedBefore) return OneGameHubError.authenticationFailedError;

      const gotRollbackBefore = await db.CasinoTransaction.findOne({
        where: { transactionId: `${transaction_id}:bet` },
        attributes: ['transactionId', 'status'],
        transaction
      });

      if (gotRollbackBefore && gotRollbackBefore.status === TRANSACTION_STATUS.CANCELLED) {
        return OneGameHubError.sessionTimeoutError;
      }
      if (gotRollbackBefore && gotRollbackBefore.status !== TRANSACTION_STATUS.FAILED) {
        return {
          status: 200,
          balance: realBalance,
          currency: currency
        };
      }

      const result = await CreateCasinoTransactionHandler.execute({
        userId,
        amount: +amount,
        casinoGameId: gameId,
        currency: coin,
        transactionId: `${transaction_id}:bet`,
        gameRoundId: round_id,
        actionType: CASINO_TRANSACTION_PURPOSE.CASINO_BET,
        metaData: this.args
      }, this.context);

      await transaction.commit();
      return {
        status: 200,
        balance: result.updatedBalance,
        currency: currency
      };
    } catch (error) {
      console.error("BetOneGameHubCasinoHandler Error:", error);
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      if (error.name === 'InsufficientFundError') {
        return {
          status: 400,
          error: 'Insufficient funds',
          message: error.message
        };
      }
      return OneGameHubError.unknownError;
    }
  }
}
