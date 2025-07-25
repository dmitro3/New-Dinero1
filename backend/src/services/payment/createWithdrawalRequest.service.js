import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { CreateWithdrawRequestHandler } from "@src/services/wallet";
import { GLOBAL_SETTING, PAYMENT_PROVIDER, VERIFF_STATUS } from "@src/utils/constant";
import { COINS } from "@src/utils/constants/public.constants";
import { ValidateWalletAddress } from "./nowPayments/validateAddress.service";

export class CreateWithdrawalRequestService extends BaseHandler {
    async run() {
        const { address, currency, userId, amount, paymentProvider } = this.args;
        const transaction = this.context.sequelizeTransaction;

        // Get user with details
        const user = await db.User.findOne({
            where: { userId },
            include: [{ model: db.UserDetails, as: 'userDetails', attributes: ['coinflowKycStatus'] }],
            transaction,
        });

        if (!user) throw new AppError(Errors.USER_NOT_EXISTS);

        // Validate KYC depending on provider
        if (paymentProvider === PAYMENT_PROVIDER.NOWPAYMENT) {
            if (user.veriffStatus !== VERIFF_STATUS.APPROVED) {
                throw new AppError(Errors.KYC_PENDING_APPROVAL);
            }
        }
        if (paymentProvider === PAYMENT_PROVIDER.COINFLOW) {
            const kycStatus = user.userDetails?.coinflowKycStatus;
            if (!kycStatus || kycStatus !== 'SUCCESS') {
                throw new AppError(Errors.COINFLOW_KYC_NOT_APPROVED);
            }
        }

        // Validate wallet and balance
        const wallet = await db.Wallet.findOne({
            where: {
                userId,
                currencyCode: COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
            },
            transaction,
        });

        if (!wallet || wallet.balance < amount) {
            throw new AppError(Errors.INSUFFICIENT_REDEEMABLE_FUNDS);
        }

        // Validate address for crypto only
        if (paymentProvider === PAYMENT_PROVIDER.NOWPAYMENT) {
            const validAddress = await ValidateWalletAddress.execute({ address, currency });
            if (!validAddress) throw new AppError(Errors.INVALID_CRYPTO_ADDRESS);
        }

        // Check withdrawal limits
        // const redeemSetting = await db.GlobalSetting.findOne({
        //     where: { key: GLOBAL_SETTING.WITHDRAWAL_LIMITS },
        //     transaction,
        // });

        // if (!redeemSetting) throw new AppError(Errors.INTERNAL_ERROR);
        // const redeemLimits = redeemSetting.value;
        // if (amount < redeemLimits.minAmount) throw new AppError(Errors.INVALID_AMOUNT);

        // Create withdrawal
        const withdrawal = await CreateWithdrawRequestHandler.execute(
            {
                amount,
                userId,
                address,
                currency,
                paymentProvider, // <-- dynamic!
            },
            this.context
        );

        return {
            success: true,
            message: 'Redeem request successfully created',
            data: withdrawal,
        };
    }

    catch(error) {
        throw new AppError(Errors.INTERNAL_SERVER_ERROR);
    }
}
