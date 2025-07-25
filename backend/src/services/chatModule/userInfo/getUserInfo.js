import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { CASINO_TRANSACTION_PURPOSE, COINS } from "@src/utils/constants/public.constants";
import { SUCCESS_MSG } from "@src/utils/success";

export class GetUserInfoHandler extends BaseHandler {
    async run() {
        const { newUserId, currencyCode } = this.args;
        const user = await db.User.findOne({
            where: { userId: newUserId },
            attributes: ['userId', 'username', 'profileImage', 'isEmailVerified'],
            include: [
                {
                    model: db.UserDetails,
                    as: "userDetails",
                    attributes: ['id'],
                    include: [
                        {
                            model: db.VipTier,
                            as: "VipTier",
                            attributes: ['vipTierId', 'name', 'level']
                        }
                    ]
                },

            ],
        });

        if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
        let whereCondition = {};
        if (currencyCode === COINS.GOLD_COIN) {
            whereCondition = { currencyCode: COINS.GOLD_COIN };
        } else if (currencyCode === COINS.SWEEP_COIN.BONUS_SWEEP_COIN) {
            whereCondition = {
                currencyCode: {
                    [db.Sequelize.Op.in]:
                        [
                            COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
                            COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
                            COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN
                        ]
                }
            };
        }
        const transactionAmounts = await db.CasinoTransaction.findAll({
            attributes: [
                [db.sequelize.col('casinoLedger.amount'), 'totalAmount'],
                [db.sequelize.col('action_type'), 'actionType'],
                [db.sequelize.col('casinoLedger.currency_code'), 'currencyCode']
            ],
            include: [
                {
                    model: db.TransactionLedger,
                    as: 'casinoLedger',
                }
            ],
            where: {
                userId: newUserId,
                actionType: [
                    CASINO_TRANSACTION_PURPOSE.CASINO_BET,
                    CASINO_TRANSACTION_PURPOSE.CASINO_WIN
                ],
                '$casinoLedger.currency_code$': whereCondition.currencyCode,
            },
            //group: ['CasinoTransaction.id', 'CasinoTransaction.action_type', 'casinoLedger.ledger_id', 'casinoLedger.currency_code'],
        });

        const totalBetAmount = transactionAmounts
            .filter(tx => tx.dataValues.actionType === CASINO_TRANSACTION_PURPOSE.CASINO_BET)
            .reduce((acc, tx) => acc + parseFloat(tx.dataValues.totalAmount || 0), 0);

        const totalWinAmount = transactionAmounts
            .filter(tx => tx.dataValues.actionType === CASINO_TRANSACTION_PURPOSE.CASINO_WIN)
            .reduce((acc, tx) => acc + parseFloat(tx.dataValues.totalAmount || 0), 0);

        const losses = Math.max(totalBetAmount - totalWinAmount, 0);
        const wageredAmount = totalBetAmount
        const result = {
            username: user.username,
            profileImage: user.profileImage,
            level: user.userDetails?.VipTier?.level,
            losses: losses,
            win: totalWinAmount,
            bet: totalBetAmount,
            wagered: wageredAmount,
            isEmailVerified: user.isEmailVerified,
        };
        return { data: result, message: SUCCESS_MSG.GET_SUCCESS };
    }
}