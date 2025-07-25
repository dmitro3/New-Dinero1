import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { TRANSACTION_STATUS } from '@src/utils/constant'
import { ACTION_TYPE } from '@src/utils/constants/casino.constants'


export default class RollbackHandler extends BaseHandler {
    async run() {
        try {
            const { accountid, gamesessionid, roundid, transactionid, gameid, frbid, casinoGameId } = this.args
            const rollbackamount = parseFloat(this.args.rollbackamount)
            const transaction = await db.sequelize.transaction()

            const user = await db.User.findOne({
                where: { userId: accountid },
                attributes: ['userId'],
                include: {
                    model: db.Wallet,
                    where: { isPrimary: true },
                    attributes: ['amount', 'walletId'],
                    required: true
                },
                transaction
            })
            if (!user) return { code: 1003 }
            const rollbackTransaction = await db.CasinoTransaction.findOne({
                where: { transactionId: transactionid, actionType: ACTION_TYPE.ROLLBACK },
                transaction
            })
            if (rollbackTransaction) {
                await transaction.rollback()
                return {
                    code: 409,
                    accounttransactionid: transactionid,
                    balance: user.Wallets[0].amount,
                    bonusmoneybet: 0.00,
                    realmoneybet: rollbackamount,
                    bonus_balance: 0.00,
                    real_balance: user.Wallets[0].amount,
                    game_mode: 1,
                    order: "cash_money, bonus_money",
                }
            }
            const betTransaction = await db.CasinoTransaction.findOne({
                where: { transactionId: transactionid, actionType: ACTION_TYPE.BET },
                transaction
            })
            if (betTransaction) {
                if (betTransaction.userId !== user.userId || betTransaction.amount !== rollbackamount) return { code: 400 }
                await db.CasinoTransaction.create({
                    userId: user.userId,
                    walletId: user.Wallets[0].walletId,
                    casinoGameId: casinoGameId,
                    transactionId: transactionid,
                    gameRoundId: roundid,
                    actionType: ACTION_TYPE.ROLLBACK,
                    amount: rollbackamount,
                    beforeAmount: user.Wallets[0].amount,
                    status: TRANSACTION_STATUS.SUCCESS,
                    currencyCode: 'USD',
                    conversionRate: 0,
                    primaryCurrencyAmount: rollbackamount,
                }, { transaction })
                await db.Wallet.update({ amount: user.Wallets[0].amount - rollbackamount },
                    { where: { walletId: user.Wallets[0].walletId }, transaction })
            }
            await transaction.commit()
            return {
                code: 200,
                balance: user.Wallets[0].amount + rollbackamount,
                bonus_balance: 0,
                real_balance: user.Wallets[0].amount + rollbackamount,
                game_mode: 1
            }
        } catch (err) {
            await transaction.rollback()
            return { code: 1, status: "Failed" }
        }
    }
}
