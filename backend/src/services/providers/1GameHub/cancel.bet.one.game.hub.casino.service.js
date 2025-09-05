import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { getCache } from '@src/libs/redis'
import { CreateCasinoTransactionHandler } from '@src/services/casino/common/createCasinoTransaction.service'
import { TRANSACTION_STATUS } from '@src/utils/constant'
import { ONE_GAME_HUB_CURRENCY_MAPPER, OneGameHubError } from '@src/utils/constants/casinoProviders/oneGameHub.constants'
import { CASINO_TRANSACTION_PURPOSE, COINS } from '@src/utils/constants/public.constants'
import { NUMBER, Op } from 'sequelize'


export class CancelBetOneGameHubCasinoHandler extends BaseHandler {
    async run() {
        const transaction = this.context.sequelizeTransaction

        try {
            const { amount, currency, player_id, transaction_id, round_id } = this.args;

            const payload = await getCache(player_id);
            if (!payload) return OneGameHubError.sessionTimeoutError;
            const { userId, coin, gameId } = JSON.parse(payload);

            if (ONE_GAME_HUB_CURRENCY_MAPPER[currency] !== coin) {
                return OneGameHubError.unsupportedCurrencyError;
            }

            const betPlaced = await db.CasinoTransaction.findOne({
                where: {
                    actionType: CASINO_TRANSACTION_PURPOSE.CASINO_BET,
                    transactionId: `${transaction_id}:bet`,
                    gameRoundId: round_id,
                },
                attributes: ['id', 'status', 'transactionId'],
                include: {
                    model: db.TransactionLedger,
                    as: 'casinoLedger',
                    attributes: ['currencyCode'],
                },
                transaction,
            });

            const gotRollbackBefore = await db.CasinoTransaction.findOne({
                where: {
                    actionType: CASINO_TRANSACTION_PURPOSE.CASINO_REFUND,
                    gameRoundId: round_id,
                    transactionId: `${transaction_id}:cancel`,
                },
                attributes: ['transactionId', 'status'],
                transaction,
            });

            if (gotRollbackBefore || !betPlaced) {
                const walletFilterCoins = coin === COINS.GOLD_COIN
                    ? [COINS.GOLD_COIN]
                    : [
                        COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
                        COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
                        COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
                    ];

                const userWallet = await db.Wallet.findAll({
                    attributes: ['id', 'balance'],
                    where: {
                        userId,
                        currencyCode: { [Op.in]: walletFilterCoins },
                    },
                    lock: true,
                    transaction,
                });

                const updatedBalance = userWallet.reduce(
                    (total, wallet) => total + (+wallet?.balance || 0),
                    0
                );

                return {
                    status: 200,
                    balance: updatedBalance,
                    currency: currency,
                };
            }

            betPlaced.status = TRANSACTION_STATUS.CANCELLED;
            await betPlaced.save({ transaction });

            const { casinoLedger } = betPlaced;
            const betCoin = casinoLedger.length
                ? casinoLedger[0]?.currencyCode
                : COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN;

            const result = await CreateCasinoTransactionHandler.execute(
                {
                    userId,
                    amount: +amount,
                    casinoGameId: gameId,
                    currency: betCoin,
                    transactionId: `${transaction_id}:cancel`,
                    gameRoundId: round_id,
                    actionType: CASINO_TRANSACTION_PURPOSE.CASINO_REFUND,
                    metaData: this.args,
                },
                this.context
            );

            await transaction.commit();
            return {
                status: 200,
                balance: result.updatedBalance,
                currency: currency,
            };
        } catch (error) {
            console.error("Error in CancelBetOneGameHubCasinoHandler:", error);
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

