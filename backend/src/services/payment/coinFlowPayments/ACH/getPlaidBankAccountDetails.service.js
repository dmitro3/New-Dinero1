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

export class GetPlaidBankAccountDetailsService extends BaseHandler {
    async run() {
        try {
            const { userId, token } = this.args
            const authRequest = { access_token: token }
            const authResponse = await client.authGet(authRequest)

            return {
                success: true,
                data: authResponse.data,
            }
        } catch (error) {
            Logger.error('Error in GetPlaidBankAccountDetailsService', { exception: error })
            throw new AppError(Errors.INTERNAL_ERROR)
        }
    }
}
