import config from '@src/configs/app.config';
import db from '@src/db/models';
import { AppError } from '@src/errors/app.error';
import { Errors } from '@src/errors/errorCodes';
import { dayjs } from '@src/libs/dayjs';
import { Logger } from '@src/libs/logger';
import { BaseHandler } from '@src/libs/logicBase';
import axios from 'axios';

export class CreateCoinFlowGooglePayService extends BaseHandler {
    async run() {
        const {
            userId,
            packageId,
            email,
            firstName,
            lastName,
            transaction,
            googlePayPaymentData // passed from frontend Google Pay success handler
        } = this.args;

        const userLimit = await db.Limit.findOne({ where: { userId } });
        if (userLimit) {
            const { isSelfExclusionPermanent, selfExclusionEndAt } = userLimit;
            if (isSelfExclusionPermanent || (selfExclusionEndAt && dayjs().isBefore(dayjs(selfExclusionEndAt)))) {
                return Errors.SELF_EXCLUSION_ACTIVE;
            }
        }

        const packageDetails = await db.Package.findOne({ where: { id: packageId, isActive: true } });
        if (!packageDetails) throw new AppError(Errors.PACKAGE_NOT_FOUND);

        const orderId = `DINERO-${userId}-${packageId}-${Date.now()}-${Math.random().toString().slice(2, 6)}`;

        const sessionRes = await axios.get('https://api-sandbox.coinflow.cash/api/auth/session-key', {
            headers: {
                'Authorization': config.get('coinFlow.apiKey'),
                'x-coinflow-auth-user-id': userId
            }
        });

        const sessionKey = sessionRes.data.sessionKey;

        const payload = {
            subtotal: {
                cents: packageDetails.amount * 100,
                currency: 'USD'
            },
            webhookInfo: {
                userId,
                orderId,
                provider: 'Google Pay',
                paymentType: 'google_pay',
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
            paymentData: googlePayPaymentData
        };

        const response = await axios.post(
            `https://api-sandbox.coinflow.cash/api/checkout/google-pay/${config.get('coinflow.merchantId')}`,
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

        await db.PaymentDetail.create({
            userId,
            paymentType: 'google_pay',
            provider: 'Google Pay',
            firstName,
            lastName
        });

        await db.ApprovelyPaymentOrder.create({
            userId,
            orderId,
            paymentType: 'google_pay',
            status: 'pending'
        });

        return {
            success: true,
            transactionId: orderId,
            message: 'Google Pay payment initiated successfully'
        };
    }
}

/*
{
  "subtotal": {
    "cents": 2500,
    "currency": "USD"
  },
  "webhookInfo": {
    "userId": "user_123",
    "orderId": "ORION-123-59-1747378476586-000123",
    "provider": "Google Pay",
    "paymentType": "google_pay",
    "packageId": 59
  },
  "transactionData": {
    "type": "safeMint",
    "transaction": {
      "data": "placeholder_data",
      "to": "recipient_wallet_address"
    }
  },
  "paymentData": {
    "paymentMethodData": {
      "type": "CARD",
      "info": {
        "cardNetwork": "VISA"
      },
      "tokenizationData": {
        "type": "PAYMENT_GATEWAY",
        "token": "your-token-here"
      }
    }
  }
}

*/