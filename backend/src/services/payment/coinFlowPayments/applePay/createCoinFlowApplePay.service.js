import config from '@src/configs/app.config';
import db from '@src/db/models';
import { AppError } from '@src/errors/app.error';
import { Errors } from '@src/errors/errorCodes';
import { dayjs } from '@src/libs/dayjs';
import { Logger } from '@src/libs/logger';
import { BaseHandler } from '@src/libs/logicBase';
import axios from 'axios';

export class CreateCoinFlowApplePayService extends BaseHandler {
    async run() {
        const {
            userId,
            packageId,
            email,
            firstName,
            lastName,
            transaction,
            applePayPaymentData // received from frontend Apple Pay JS SDK
        } = this.args;

        // 1. Check self-exclusion logic
        const userLimit = await db.Limit.findOne({ where: { userId } });
        if (userLimit) {
            const { isSelfExclusionPermanent, selfExclusionEndAt } = userLimit;
            if (isSelfExclusionPermanent || (selfExclusionEndAt && dayjs().isBefore(dayjs(selfExclusionEndAt)))) {
                return Errors.SELF_EXCLUSION_ACTIVE;
            }
        }

        // 2. Fetch the package
        const packageDetails = await db.Package.findOne({ where: { id: packageId, isActive: true } });
        if (!packageDetails) throw new AppError(Errors.PACKAGE_NOT_FOUND);

        const orderId = `DINERO-${userId}-${packageId}-${Date.now()}-${Math.random().toString().slice(2, 6)}`;

        // 3. Get Coinflow session key
        const sessionRes = await axios.get('https://api-sandbox.coinflow.cash/api/auth/session-key', {
            headers: {
                'Authorization': config.get('coinFlow.apiKey'),
                'x-coinflow-auth-user-id': userId
            }
        });

        const sessionKey = sessionRes.data.sessionKey;

        // 4. Build payload for Coinflow Apple Pay API
        const payload = {
            subtotal: {
                cents: packageDetails.amount * 100, // convert to cents
                currency: 'USD'
            },
            webhookInfo: {
                userId,
                orderId,
                provider: 'Apple Pay',
                paymentType: 'apple_pay',
                packageId
            },
            transactionData: {
                type: 'safeMint',
                transaction: {
                    data: transaction || 'placeholder',
                    to: 'recipient_wallet_address'
                },
                waitForHash: true,
                nftContract: 'nft_contract_address'
            },
            applePayPayment: applePayPaymentData // Token received from frontend Apple Pay
        };

        // 5. Call Coinflow API to process Apple Pay
        const response = await axios.post(
            `https://api-sandbox.coinflow.cash/api/checkout/v2/apple-pay/${config.get('coinflow.merchantId')}`,
            payload,
            {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'Authorization': config.get('coinFlow.apiKey'),
                    'x-coinflow-auth-session-key': sessionKey
                }
            }
        );

        // 6. Save payment details locally
        await db.PaymentDetail.create({
            userId,
            paymentType: 'apple_pay',
            provider: 'Apple Pay',
            firstName,
            lastName
        });

        await db.ApprovelyPaymentOrder.create({
            userId,
            orderId,
            paymentType: 'apple_pay',
            status: 'pending'
        });

        return {
            success: true,
            transactionId: orderId,
            message: 'Apple Pay payment initiated successfully',
            coinflowResponse: response.data
        };
    }
}
