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
} from '@src/utils/constant';
import {
  TRANSACTION_PURPOSE
} from '@src/utils/constants/public.constants';
const { Op } = require('sequelize');

export class CreateCoinFlowExistingAccountPaymentService extends BaseHandler {
  async run () {
    try {
      const {
        packageId,
        paymentType,
        userId,
        paymentDetailId
      } = this.args;

      const transaction = this.context.sequelizeTransaction;

      // Step 1: Self-exclusion check
      const userLimit = await db.Limit.findOne({ where: { userId } });
      if (userLimit) {
        const { isSelfExclusionPermanent, selfExclusionEndAt } = userLimit;
        const isValidDate = selfExclusionEndAt && dayjs(selfExclusionEndAt).isValid();
        if (isSelfExclusionPermanent || (isValidDate && dayjs().isBefore(dayjs(selfExclusionEndAt)))) {
          return Errors.SELF_EXCLUSION_ACTIVE;
        }
      }
      // Step 2: Validate package
      const packageDetails = await db.Package.findOne({
        where: { id: packageId, isActive: true },
        attributes: ['id', 'amount']
      });

      if (!packageDetails) throw new AppError(Errors.PACKAGE_NOT_FOUND);

      // Step 3: Retrieve saved card token from PaymentDetail
      const paymentRecord = await db.PaymentDetail.findOne({
        where: {
          id: paymentDetailId,
          userId,
          hasCheckoutPermission: true,
          token: {
            [Op.not]: null
          },
          paymentType
        }
      });

      if (!paymentRecord || !paymentRecord.token) {
        throw new AppError(Errors.PAYMENT_PROVIDER_NOT_FOUND_ERROR);
      }

      const token = paymentRecord.token;
      const orderId = `DINERO-${userId}-${packageDetails.id}-${dayjs().valueOf()}-${Math.random().toString().substring(2, 8)}`;

      // Step 4: Get CoinFlow session key
      const sessionKeyRes = await axios.get(`${config.get('coinFlow.baseUrl')}/api/auth/session-key`, {
        headers: {
          'x-coinflow-auth-user-id': String(userId),
          'Authorization': config.get('coinFlow.apiKey'),
        },
      });

      const sessionKey = sessionKeyRes?.data?.sessionKey || sessionKeyRes?.data?.key;
      if (!sessionKey) throw new AppError(Errors.INTERNAL_ERROR);

      // Step 5: Construct payload
      const payload = {
        subtotal: {
          currency: 'USD',
          cents: packageDetails.amount * 100,
        },
        webhookInfo: {
          userId,
          orderId,
          paymentType,
          packageId: packageDetails.id
        },
        token
      };

      // Step 6: Call CoinFlow saved card checkout endpoint
      const response = await axios.post(
        `${config.get('coinFlow.baseUrl')}/api/checkout/token/${config.get('coinFlow.merchantId')}`,
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

      // Step 7: Store order and transaction
      await db.ApprovelyPaymentOrder.create({
        userId,
        orderId,
        paymentType,
        status: 'pending',
      });

      await db.Transaction.create(
        {
          userId,
          purpose: TRANSACTION_PURPOSE.PURCHASE,
          paymentProviderId: response.data.paymentId.toString(),
          status: TRANSACTION_STATUS.PENDING,
          paymentProvider: PAYMENT_PROVIDER.APPROVELY,
          moreDetails: { ...payload },
        },
        { transaction }
      );

      return {
        success: true,
        data: response.data,
        message: 'Card payment initiated successfully',
      };
    } catch (error) {
      Logger.error('Error in CreateCoinFlowSavedCardPaymentService', { exception: error });
      throw new AppError(Errors.INTERNAL_ERROR);
    }
  }
}
