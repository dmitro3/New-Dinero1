import config from '@src/configs/app.config';
import { AppError } from '@src/errors/app.error';
import { Errors } from '@src/errors/errorCodes';
import axios from 'axios';
import { BaseHandler } from '@src/libs/logicBase';
import { Logger } from '@src/libs/logger';

export class CreateCoinFlowKycService extends BaseHandler {
  async run() {
    try {
      const { userId, email, country = 'US' } = this.args;

      const kycPayload = {
        merchantId: config.get('coinFlow.merchantId'),
        email,
        country,
        redirectLink: config.get('app.userFrontendUrl')
      };
      let response;
      try {
        response = await axios.post(
          `${config.get('coinFlow.baseUrl')}/api/withdraw/kyc`,
          kycPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: config.get('coinFlow.apiKey'),
              'x-coinflow-auth-user-id': String(userId),
            },
            // validateStatus: () => true, // To manually handle all response statuses
            validateStatus: (status) => [200, 451].includes(status),
          }
        );

      } catch (error) {
        console.log("  error error error error ", error)
      }

      const resData = response.data;

      if (response.status === 200 || response.status === 451) {
        const verificationStatus = resData?.verification?.status || 'unknown';

        return {
          success: true,
          verificationStatus,
          requiresRedirect: verificationStatus === 'pending',
          verificationLink: resData?.verificationLink || null,
          withdrawerId: resData?.withdrawer?._id,
          wallets: resData?.withdrawer?.wallets || [],
          raw: resData, // Optional: return full response for debugging
        };
      }

      Logger.error('CoinFlow KYC error response', {
        status: response.status,
        data: resData,
      });

      throw new AppError(Errors.INTERNAL_ERROR, 'CoinFlow KYC verification failed');

    } catch (error) {
      Logger.error('CreateCoinFlowKycService error', { exception: error });
      throw new AppError(Errors.INTERNAL_ERROR, 'An error occurred during KYC verification');
    }
  }
}
