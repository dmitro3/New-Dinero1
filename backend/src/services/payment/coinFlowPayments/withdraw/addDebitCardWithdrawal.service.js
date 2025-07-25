import config from '@src/configs/app.config'
import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import axios from 'axios'

export class CreateCoinFlowDebitCardWithdrawalService extends BaseHandler {
  async run () {
    try {
      const { userId, token, expMonth, expYear, lastFour } = this.args;

      const sessionKeyRes = await axios.get(`${config.get('coinFlow.baseUrl')}/api/auth/session-key`, {
        headers: {
          'x-coinflow-auth-user-id': String(userId),
          Authorization: config.get('coinFlow.apiKey'),
        },
      });

      const sessionKey = sessionKeyRes?.data?.sessionKey || sessionKeyRes?.data?.key;
      if (!sessionKey) throw new AppError(Errors.INTERNAL_ERROR);

      const payload = {
        cardToken: token,
        expMonth,
        expYear,
        "address": {
          "address1": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zip": "10001",
          "country": "US"
        }
      };

      const withdrawRes = await axios.post(
        `${config.get('coinFlow.baseUrl')}/api/withdraw/debit-card`,
        payload,
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-coinflow-auth-user-id': String(userId),
            Authorization: config.get('coinFlow.apiKey'),
          },
        }
      );
      const existing = await db.PaymentDetail.findOne({
        where: {
          userId,
          token,
          paymentType: 'CARD',
        },
      });

      if (existing) {
        if (!existing.hasWithdrawalPermission) {
          await existing.update({
            hasWithdrawalPermission: true,
            isActive: true,
          });
        }
      } else {
        await db.PaymentDetail.create({
          userId,
          paymentType: 'CARD',
          token,
          lastFourDigits: lastFour,
          // provider: 'VISA', // optional, or use type if available
          achAccessToken: null,
          isActive: true,
          hasCheckoutPermission: false,
          hasWithdrawalPermission: true,
        });
      }

      return {
        success: true,
        message: 'Withdrawal Card submitted successfully',
        data: withdrawRes.data,
      };

    } catch (error) {
      console.error('Error in CreateCoinFlowDebitCardWithdrawalService', error);
      throw new AppError(Errors.INTERNAL_ERROR);
    }
  }
}
