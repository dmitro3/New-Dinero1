import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { serverDayjs } from '@src/libs/dayjs'
import { BaseHandler } from '@src/libs/logicBase'
import { TRANSACTION_PURPOSE } from '@src/utils/constants/public.constants'
import { SUCCESS_MSG } from '@src/utils/success'
import { TransactionHandlerHandler } from '../../wallet'

export class ClaimBonusDropHandler extends BaseHandler {

    async run() {
        const { userId, code } = this.args;

        const transaction = this.context.sequelizeTransaction
        const bonus = await db.DropBonus.findOne({
            where: { code: code, isActive: true },
            transaction
        })

        if (!bonus) {
            throw new AppError(Errors.BONUS_NOT_FOUND)
        }
        const bonusId = bonus.id
        const existingClaim = await db.BonusClaim.findOne({
            where: { userId, bonusId },
            transaction
        })

        if (existingClaim) {
            throw new AppError(Errors.BONUS_ALREADY_CLAIMED)
        }
        const currentUTCDate = serverDayjs()
        const expiryTime = serverDayjs(bonus.expiryTime)
        if (expiryTime <= currentUTCDate) {
            throw new AppError(Errors.BONUS_EXPIRED)
        }
        if (bonus.totalClaims >= bonus.totalClaimsAllowed) {
            throw new AppError(Errors.BONUS_CLAIM_LIMIT_REACHED)
        }

        const claim = await db.BonusClaim.create({
            userId,
            bonusId,
            claimCoin: bonus.coin,
        }, { transaction })
        // Increment totalClaims for the bonus
        await Promise.all([
            db.DropBonus.update(
                { totalClaims: bonus.totalClaims + 1 },
                { where: { id: bonusId }, transaction }
            ),
            TransactionHandlerHandler.execute({ userId, amount: bonus.coin, currencyCode: bonus.coinType, purpose: TRANSACTION_PURPOSE.BONUS_DROP }, this.context)
        ])

        return {
            claim,
            message: SUCCESS_MSG.CLAIM_SUCCESS
        }
    }
}