import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid'
const config = require('@src/configs/app.config');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': config.get('coinFlow.plaidCredentials.plaidClientId'),
      'PLAID-SECRET': config.get('coinFlow.plaidCredentials.plaidSecret'),
    },
  },
})
const client = new PlaidApi(configuration)

export class CreatePlaidLinkTokenService extends BaseHandler {
  async run () {
    try {
      const { userId } = this.args

      const user = await db.User.findByPk(userId)
      if (!user) throw new AppError(Errors.USER_NOT_EXISTS)

      const request = {
        user: {
          client_user_id: `${userId}`,
        },
        client_name: 'Dinero Sweeps',
        products: ['auth'],
        language: 'en',
        webhook: config.get('app.userFrontendUrl'),
        country_codes: ['US'],
      }

      const response = await client.linkTokenCreate(request)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      Logger.error('Error in CreatePlaidLinkTokenService', { exception: error })
      throw new AppError(Errors.INTERNAL_ERROR)
    }
  }
}
