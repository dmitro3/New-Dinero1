import { BaseHandler } from '@src/libs/logicBase'
import { MathPrecision } from '@src/libs/mathOperation'
import { getCache } from '@src/libs/redis'
import { CreateCasinoTransactionHandler } from '@src/services/casino/common/createCasinoTransaction.service'
import { TRANSACTION_STATUS } from '@src/utils/constant'
import { ONE_GAME_HUB_CURRENCY_MAPPER, OneGameHubError } from '@src/utils/constants/casinoProviders/oneGameHub.constants'
import { CASINO_TRANSACTION_PURPOSE, COINS } from '@src/utils/constants/public.constants'
import { SendRecentBigWinHandler } from '@src/services/leaderBoard/sendRecentBigWinHandler'
import db from '@src/db/models'
import { Op } from 'sequelize'
import querystring from 'querystring'


export class WinOneGameHubGameCasinoHandler extends BaseHandler {
  async run() {

    const { transaction_id, currency, game_id, player_id, amount, round_id, ext_round_id, ext_round_finished, freerounds_id, extra } = this.args
    const transaction = this.dbTransaction

    const payload = await getCache(player_id)
    if (!payload) return OneGameHubError.sessionTimeoutError

    const { userId, coin, gameId, providerCasinoGameId } = JSON.parse(payload)

    if (ONE_GAME_HUB_CURRENCY_MAPPER[currency] !== coin) return OneGameHubError.unsupportedCurrencyError

    const isGameCoin = coin === COINS.GOLD_COIN

    const walletFilterCoins = isGameCoin
      ? [COINS.GOLD_COIN]
      : [
        COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
        COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
        COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
      ]

    try {
      if (+amount < 0) return OneGameHubError.unknownError

      const checkTransaction = await db.CasinoTransaction.findOne({
        where: {
          userId,
          gameRoundId: round_id,
        },
        attributes: ['transactionId'],
        transaction
      })

      if (!checkTransaction) {
        return OneGameHubError.unknownError
      }

      const isRoundCancelled = await db.CasinoTransaction.findOne({
        where: {
          actionType: CASINO_TRANSACTION_PURPOSE.CASINO_BET,
          status: { [Op.ne]: TRANSACTION_STATUS.CANCELLED }, // Exclude cancelled transactions
          gameRoundId: round_id,
        },
        attributes: ['transactionId'],
        transaction
      });

      if (!isRoundCancelled)
        return OneGameHubError.unknownError

      const checkWinTransaction = await db.CasinoTransaction.findOne({
        where: {
          transactionId: {
            [db.Sequelize.Op.in]: [`${transaction_id}:win`, `${transaction_id}:cancel`]
          },
          gameRoundId: round_id, // round.id
        },
        attributes: ['transactionId'],
        transaction
      });

      if (checkWinTransaction) {

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
          status: 200,
          balance: updatedBalance,
          currency: currency
        }
      } else {

        // issue_1 this part will never exicute because transactionId = "4345:bet" and transaction_id = "4345"
        if (checkTransaction.transactionId === transaction_id) {
          const userWallet = await db.Wallet.findOne({
            where: {
              userId,
              currencyCode: { [Op.in]: walletFilterCoins },
            },
            lock: true,
            transaction
          })
          const updatedBalance = userWallet.reduce((total, wallet) => MathPrecision.plus(total, wallet.balance), 0)
          // newBalance = updatedBalance

          return {
            status: 200,
            balance: updatedBalance,
            currency: currency
          }
        }
      }

      const result = await CreateCasinoTransactionHandler.execute({
        userId,
        amount: +amount,
        casinoGameId: gameId,
        currency: coin,
        transactionId: `${transaction_id}:win`,
        gameRoundId: round_id,//round.id,
        roundStatus: ext_round_finished == 0 ? false : true,
        actionType: CASINO_TRANSACTION_PURPOSE.CASINO_WIN,
        status: TRANSACTION_STATUS.SUCCESS,
        metaData: this.args
      }, this.context)

      if (coin !== COINS.GOLD_COIN && amount > 0) {

        SendRecentBigWinHandler.execute({ userId, roundId: round_id, amount, gameId })

      }
      await transaction.commit();

      return {
        status: 200,
        balance: result.updatedBalance, // issue_1 here updated balance will never able to calculate properly
        currency: currency
      }

    } catch (error) {
      console.error("WinOneGameHubGameCasinoHandler Error:", error);
      if (transaction) {
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
