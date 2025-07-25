import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { TRANSACTION_STATUS } from '@src/utils/constant'
import { ACTION_TYPE } from '@src/utils/constants/casino.constants'


export default class PlaceBetHandler extends BaseHandler {
    async run() {
        try {
            const { accountid, gamesessionid, roundid, transactionid, frbid, casinoGameId } = this.args
            const betamount = parseFloat(this.args.betamount)
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
            if (user.Wallets[0].amount < betamount) return { code: 1006 }
            const transactionExists = await db.CasinoTransaction.findOne({
                where: { transactionId: transactionid },
                transaction
            })
            if (transactionExists) {
                await transaction.rollback()
                return {
                    code: 409,
                    accounttransactionid: transactionid,
                    balance: user.Wallets[0].amount,
                    bonusmoneybet: 0.00,
                    realmoneybet: betamount,
                    bonus_balance: 0.00,
                    real_balance: user.Wallets[0].amount,
                    game_mode: 1,
                    order: "cash_money, bonus_money",
                }
            }
            await db.CasinoTransaction.create({
                userId: user.userId,
                walletId: user.Wallets[0].walletId,
                casinoGameId: casinoGameId,
                transactionId: transactionid,
                gameRoundId: roundid,
                actionType: ACTION_TYPE.BET,
                amount: betamount,
                beforeAmount: user.Wallets[0].amount,
                status: TRANSACTION_STATUS.SUCCESS,
                currencyCode: 'USD',
                conversionRate: 0,
                primaryCurrencyAmount: betamount,
            }, { transaction })
            await db.Wallet.update({ amount: user.Wallets[0].amount - betamount },
                { where: { walletId: user.Wallets[0].walletId }, transaction })
            await transaction.commit()
            return {
                code: 200,
                balance: user.Wallets[0].amount - betamount,
                bonus_balance: 0,
                real_balance: user.Wallets[0].amount - betamount,
                game_mode: 1
            }
        } catch (err) {
            await transaction.rollback()
            return { code: 1, status: "Failed" }
        }
    }

}