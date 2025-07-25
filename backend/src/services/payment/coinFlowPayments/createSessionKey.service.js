const axios = require('axios');
const config = require('@src/configs/app.config');
const { AppError } = require('@src/errors/app.error');
const { Errors } = require('@src/errors/errorCodes');
const { BaseHandler } = require('@src/libs/logicBase');


export class GetCoinFlowSessionKeyService extends BaseHandler {
  async run () {
    try {
      const { userId } = this.args;
      if (!userId) {
        throw new AppError(Errors.BAD_REQUEST, 'Missing userId');
      }
      const sessionKeyRes = await axios.get(`${config.get('coinFlow.baseUrl')}/api/auth/session-key`, {
        headers: {
          'x-coinflow-auth-user-id': String(userId),
          'Authorization': config.get('coinFlow.apiKey'),
          accept: 'application/json',
        },
      });
      const sessionKey = sessionKeyRes?.data?.sessionKey || sessionKeyRes?.data?.key;
      if (!sessionKey) {
        throw new AppError(Errors.INTERNAL_ERROR);
      }
      return { message: "Success", result: sessionKey };
    } catch (error) {
      console.error('Error fetching Coinflow session key:', error?.response?.data || error.message);
      throw new AppError(Errors.INTERNAL_SERVER_ERROR);
    }
  }
}
