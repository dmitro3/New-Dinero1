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
  COINS,
  LEDGER_DIRECTIONS,
  LEDGER_TRANSACTION_TYPES,
  TRANSACTION_PURPOSE,
  WITHDRAWAL_STATUS
} from "@src/utils/constants/public.constants";
const { Op } = require('sequelize');

export class CreateCoinFlowAchPaymentService extends BaseHandler {
  async run () {
    try {
      const {
        packageId,
        paymentType = 'ACH',
        userId,
        // token,
        paymentDetailId,
        email,
        firstName,
        lastName,
        // transaction
      } = this.args;
      const transaction = this.context.sequelizeTransaction;

      // Self-exclusion check
      const userLimit = await db.Limit.findOne({ where: { userId } });
      if (userLimit) {
        const { isSelfExclusionPermanent, selfExclusionEndAt } = userLimit;
        const isValidDate = selfExclusionEndAt && dayjs(selfExclusionEndAt).isValid();
        if (isSelfExclusionPermanent || (isValidDate && dayjs().isBefore(dayjs(selfExclusionEndAt)))) {
          return Errors.SELF_EXCLUSION_ACTIVE;
        }
      }

      // Validate package
      const packageDetails = await db.Package.findOne({
        where: { id: packageId, isActive: true },
        attributes: ['id', 'amount']
      });
      if (!packageDetails) throw new AppError(Errors.PACKAGE_NOT_FOUND);
      const paymentRecord = await db.PaymentDetail.findOne({
        where: {
          id: paymentDetailId,
          hasCheckoutPermission: true,
          userId,
          token: {
            [Op.not]: null
          }
        }
      });

      if (!paymentRecord) {
        throw new AppError(Errors.PAYMENT_PROVIDER_NOT_FOUND_ERROR);
      }

      const token = paymentRecord.token;

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
        // fixedFee: { cents: 0 }, // check can we remove this also
        customerInfo: {
          firstName,
          lastName,
        },
        subtotal: {
          cents: packageDetails.amount * 100,
        },
        webhookInfo: {
          userId: userId,
          orderId: orderId,
          // provider: provider,
          paymentType: paymentType,
          packageId: packageDetails.id
        },
        // nearDeposit: {
        //   yocto: '45425',
        // },
        // transactionData: {
        //   transaction: {
        //     data: transaction || '0xabcdef1234567890',
        //     to: '0x1234567890abcdef1234567890abcdef12345678',
        //   },
        //   type: 'safeMint',
        // },
        token,
      }
      const response = await axios.post(
        `${config.get('coinFlow.baseUrl')}/api/checkout/ach/${config.get('coinFlow.merchantId')}`,
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

      await db.ApprovelyPaymentOrder.create({
        userId,
        orderId,
        paymentType,
        status: 'pending',
      });
      const transactionData = await db.Transaction.create(
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

      return {
        success: true,
        data: response.data,
        // transactionData: transactionData,
        message: 'ACH Payment initiated successfully',
      };
    } catch (error) {
      Logger.error('Error in CreateCoinFlowAchPaymentService', { exception: error });
      throw new AppError(Errors.INTERNAL_ERROR);
    }
  }
}
