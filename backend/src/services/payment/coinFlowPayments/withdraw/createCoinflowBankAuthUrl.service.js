import config from '@src/configs/app.config';
import { AppError } from '@src/errors/app.error';
import { Errors } from '@src/errors/errorCodes';
import { BaseHandler } from '@src/libs/logicBase';
import axios from 'axios';
import { Logger } from '@src/libs/logger';

export class CreateCoinflowBankAuthUrlService extends BaseHandler {
  async run () {
    try {
      const { userId, country = 'US' } = this.args;

      // Step 1: Get session key
      const sessionKeyRes = await axios.get(`${config.get('coinFlow.baseUrl')}/api/auth/session-key`, {
        headers: {
          'x-coinflow-auth-user-id': String(userId),
          'Authorization': config.get('coinFlow.apiKey'),
        },
      });

      const sessionKey = sessionKeyRes?.data?.sessionKey || sessionKeyRes?.data?.key;

      if (!sessionKey) {
        throw new AppError(Errors.INTERNAL_ERROR, 'Failed to generate session key');
      }

      // Step 2: Build the iframe URL
      const merchantId = config.get('coinFlow.merchantId');
      const baseUrl = config.get('coinFlow.baseOriginUrl')
      const redirectLink = config.get('app.userFrontendUrl')

      const iframeUrl = `${baseUrl}/solana/withdraw/${merchantId}?sessionKey=${encodeURIComponent(sessionKey)}&bankAccountLinkRedirect=${encodeURIComponent(redirectLink)}`;
      // const iframeUrl = `${baseUrl}/solana/withdraw/${merchantId}?sessionKey=${encodeURIComponent(sessionKey)}`;

      return {
        success: true,
        iframeUrl,
        message: 'Bank authentication URL generated successfully',
      };
    } catch (error) {
      Logger.error('CreateCoinflowBankAuthUrlService error', { exception: error });
      throw new AppError(Errors.INTERNAL_ERROR, 'An error occurred while generating bank auth URL');
    }
  }
}
