import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
// import { db } from '@src/db/models'
import db from '@src/db/models'
import { GLOBAL_SETTING } from "@src/utils/constant";
import { POSTAL_CODE_STATUS } from "@src/utils/constants/public.constants";
import { SUCCESS_MSG } from '@src/utils/success'
import { dayjs } from '@src/libs/dayjs'
import { COINS, TRANSACTION_PURPOSE } from "@src/utils/constants/public.constants";
import { MathPrecision } from '@src/libs/mathOperation'
import { Op } from 'sequelize'

export class ClaimPostalCodeRequestHandler extends BaseHandler {
    async run() {
        const { userId, email, postalCode } = this.args

        const transaction = this.context.sequelizeTransaction
        // Check if the user exists
        const user = await db.User.findOne({
            where: { userId: userId },
            transaction,
        })

        if (!user) {
            throw new AppError(Errors.USER_NOT_EXISTS)
        }
        if (user.isEmailVerified === false || user.email !== email) {
            throw new AppError(Errors.EMAIL_NOT_VERIFIED)
        }

        // POSTAL_CODE_BONUS AMOE 
        const postaldata = await db.GlobalSetting.findOne({
            where: { key: GLOBAL_SETTING.POSTAL_CODE },
            transaction,
        })

        if (!postaldata) {
            throw new AppError(Errors.POSTAL_CODE_NOT_FOUND)
        }
        const gcCoin = postaldata.value.gcCoin
        const scCoin = postaldata.value.scCoin
        const postalCodeValidTill = postaldata.value.postalCodeValidTill
        const createdAt = postaldata.createdAt

        const daysInCurrentPostalCode = dayjs().diff(dayjs(createdAt), 'day'); // Calculate difference in days
        // Check if the postal code time is long enough
        if (daysInCurrentPostalCode > postalCodeValidTill) {
            throw new AppError(Errors.POSTAL_CODE_EXPIRED)
        }



        const existingRequest = await db.PostalCode.findOne({
            where: {
                userId: userId,
                status: POSTAL_CODE_STATUS.PENDING
            },
            transaction
        })

        if (existingRequest) {
            throw new AppError(Errors.EXISTING_PENDING_POSTAL_CODE_REQUEST)
        }

        const walletFilterCoins = [
            COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
            COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
            COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
        ]

        const wallets = await db.Wallet.findAll({
            where: {
                userId,
                currencyCode: { [Op.in]: walletFilterCoins },
            },
            lock: true,
            transaction,
        })

        // Calculate total balance
        const totalBalance = wallets.reduce(
            (total, wallet) => MathPrecision.plus(total, wallet.balance),
            0
        )

        if (totalBalance > 0) {
            throw new AppError(Errors.INVALID_POSTAL_CODE_REQUEST)
        }

        const postalCodeEntry = await db.PostalCode.create({
            userId,
            email,
            postalCode: postalCode,
            gcCoin: gcCoin,
            scCoin: scCoin,
            status: POSTAL_CODE_STATUS.PENDING,
        }, { transaction })

        return {
            postalCodeEntry,
            message: SUCCESS_MSG.POSTAL_CODE_SUCCESS,
        }
    }
}
