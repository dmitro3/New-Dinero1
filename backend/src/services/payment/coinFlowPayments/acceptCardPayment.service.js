import config from '@src/configs/app.config';
import db from '@src/db/models';
import { AppError } from '@src/errors/app.error';
import { Errors } from '@src/errors/errorCodes';
import { dayjs } from '@src/libs/dayjs';
import { Logger } from '@src/libs/logger';
import { BaseHandler } from '@src/libs/logicBase';
import axios from 'axios';
import {
  PAYMENT_PROVIDER,
  TRANSACTION_STATUS
} from "@src/utils/constant";
import {
  TRANSACTION_PURPOSE,
} from "@src/utils/constants/public.constants";

export class CreateCoinFlowCardPaymentService extends BaseHandler {
  async run () {
    try {
      const {
        packageId,
        userId,
        cardToken,
        expMonth,
        expYear,
        firstName,
        lastName,
        email,
        address1,
        city,
        zip,
        paymentType = 'CARD',
        state,
        lastFour,
        country,
        saveCard = true
      } = this.args;
      const transaction = this.context.sequelizeTransaction;

      const userLimit = await db.Limit.findOne({ where: { userId } });
      if (userLimit) {
        const { isSelfExclusionPermanent, selfExclusionEndAt } = userLimit;
        const isValidDate = selfExclusionEndAt && dayjs(selfExclusionEndAt).isValid();
        if (isSelfExclusionPermanent || (isValidDate && dayjs().isBefore(dayjs(selfExclusionEndAt)))) {
          return Errors.SELF_EXCLUSION_ACTIVE;
        }
      }

      const packageDetails = await db.Package.findOne({
        where: { id: packageId, isActive: true },
        attributes: ['id', 'amount']
      });

      if (!packageDetails) throw new AppError(Errors.PACKAGE_NOT_FOUND);

      const orderId = `DINERO-${userId}-${packageDetails.id}-${dayjs().valueOf()}-${Math.random().toString().substring(2, 8)}`;

      const sessionKeyRes = await axios.get(`${config.get('coinFlow.baseUrl')}/api/auth/session-key`, {
        headers: {
          'x-coinflow-auth-user-id': String(userId),
          'Authorization': config.get('coinFlow.apiKey'),
        },
      });


      const sessionKey = sessionKeyRes?.data?.sessionKey || sessionKeyRes?.data?.key;
      if (!sessionKey) {
        throw new AppError(Errors.INTERNAL_ERROR);
      }

      const payload = {
        subtotal: {
          currency: 'USD',
          cents: packageDetails.amount * 100
        },
        webhookInfo: {
          userId: userId,
          orderId: orderId,
          // provider: provider,
          paymentType: paymentType,
          packageId: packageDetails.id
        },
        card: {
          cardToken,
          expMonth,
          expYear,
          email,
          firstName,
          lastName,
          address1,
          city,
          zip,
          state,
          country
        },
        saveCard
      }

      // Step 4: Create card payment
      const response = await axios.post(
        `${config.get('coinFlow.baseUrl')}/api/checkout/card/${config.get('coinFlow.merchantId')}`,
        payload,
        {
          headers: {
            'content-type': 'application/json',
            'x-coinflow-auth-session-key': sessionKey,
            accept: 'application/json',
            Authorization: `Bearer ${config.get('coinFlow.apiKey')}`,
          },
        }
      );

      // Step 5: Store order
      await db.ApprovelyPaymentOrder.create({
        userId,
        orderId,
        paymentType: paymentType,
        status: 'pending',
      });
      let transactionData;
      try {
        transactionData = await db.Transaction.create(
          {
            userId: userId,
            // actioneeId: userId,
            purpose: TRANSACTION_PURPOSE.PURCHASE,
            // actioneeType: WALLET_OWNER_TYPES.USER,
            paymentProviderId: response.data.paymentId.toString(),
            status: TRANSACTION_STATUS.PENDING,
            paymentProvider: PAYMENT_PROVIDER.APPROVELY,
            moreDetails: { ...payload },
          },
          { transaction }
        );

      } catch (error) {
        console.log(" card checkout transactionData  error", error)

      }

      const existingRecord = await db.PaymentDetail.findOne({
        where: {
          userId,
          token: cardToken,
          paymentType,
        },
      });

      if (existingRecord) {
        if (!existingRecord.hasCheckoutPermission) {
          await existingRecord.update({ hasCheckoutPermission: true });
        }
      } else {
        await db.PaymentDetail.create({
          userId,
          token: cardToken,
          paymentType,
          achAccessToken: null, // remains null for cards
          lastFourDigits: String(lastFour),
          hasCheckoutPermission: true,
          hasWithdrawalPermission: false,
          isActive: true
        });
      }

      return {
        success: true,
        data: response.data,
        message: 'Card payment initiated successfully',
      };

    } catch (error) {
      Logger.error('Error in CreateCoinFlowCardPaymentService', { exception: error });
      throw new AppError(Errors.INTERNAL_ERROR);
    }
  }
}
