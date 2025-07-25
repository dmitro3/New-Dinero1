import db from '@src/db/models'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import { TransactionHandlerHandler, TransactionScGcHandler } from '@src/services/wallet'
import { BONUS_STATUS, BONUS_TYPE } from '@src/utils/constants/bonus.constants'
import { COINS, TRANSACTION_PURPOSE } from '@src/utils/constants/public.constants'
import { NUMBER, Op } from 'sequelize'
import {
    PAYMENT_PROVIDER,
    TRANSACTION_STATUS
} from "@src/utils/constant";


export class ClaimDepositBonusHandler extends BaseHandler {
    get constraints() {
        return constraints
    }

    async run() {
        try {


            var { userId, gcCoins, scCoins } = this.args;
            const transaction = this.context.sequelizeTransaction

            const userTransaction = await db.Transaction.count({
                where: { purpose: TRANSACTION_PURPOSE.PURCHASE, userId: userId, status: TRANSACTION_STATUS.SUCCESS, paymentProviderId: { [db.Sequelize.Op.ne]: null } }
            })
            if (userTransaction >= 3) return { success: false }


            let bonusType;
            if (userTransaction === 0) {
                bonusType = BONUS_TYPE.FIRST_PURCHASE;
            } else if (userTransaction === 1) {
                bonusType = BONUS_TYPE.SECOND_PURCHASE;
            } else if (userTransaction === 2) {
                bonusType = BONUS_TYPE.THIRD_PURCHASE;
            }

            const activeBonus = await db.Bonus.findAll({
                where: { status: BONUS_STATUS.ACTIVE, bonusType: { [Op.in]: [bonusType] } },
                attributes: ['id', 'status', 'gcAmount', 'scAmount', 'percentage', 'maxBonusLimit', 'description'],
                order: [['createdAt', 'DESC']]
            })
            if (!activeBonus || activeBonus.length === 0) {

                return { success: true }
            }

            if (typeof scCoins !== 'number' || isNaN(scCoins)) {
                console.error('Invalid value for scCoins');
            }
            if (typeof gcCoins !== 'number' || isNaN(gcCoins)) {
                console.error('Invalid value for gcCoins');
            }

            const currentDepositBonus = activeBonus[0];
            const depositPercentage = Number(currentDepositBonus.percentage);

            let scBonusCoins = (Number(scCoins) * Number(depositPercentage)) / 100;
            let gcBonusCoins = (Number(gcCoins) * Number(depositPercentage)) / 100;
            scBonusCoins = scBonusCoins.toFixed(2);
            gcBonusCoins = gcBonusCoins.toFixed(2);
            if (scBonusCoins > activeBonus[0].maxBonusLimit) {
                scBonusCoins = activeBonus[0].maxBonusLimit
            }
            await TransactionScGcHandler.execute({
                userId: userId,
                coinData: [
                    { amount: gcBonusCoins, currencyCode: COINS.GOLD_COIN, },
                    { amount: scBonusCoins, currencyCode: COINS.SWEEP_COIN.BONUS_SWEEP_COIN, },
                ],
                purpose: TRANSACTION_PURPOSE.BONUS_DEPOSIT,
            }, this.context)

            const bonusData = await db.UserBonus.create({
                userId,
                bonusId: activeBonus[0].id,
                gcAmount: gcBonusCoins,
                scAmount: scBonusCoins,
            }, { transaction })

        } catch (error) {
            Logger.info(error)
        }

        return { success: true }

    }
}