import config from '@src/configs/app.config'
import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import axios from 'axios'

export class AddCoinflowBankAccountService extends BaseHandler {
  async run() {
    try {
      const {
        userId,
        plaidAccessToken,
        email,
        alias,
        routingNumber,
        accountNumber,
        accountType,
        firstName,
        lastName,
        city,
        state,
        zip,
        country,
        address1,
        address2,
        businessName,
        rtpEligible
      } = this.args


      if (!userId || !email || !routingNumber || !accountNumber) {
        throw new AppError(Errors.BAD_REQUEST, 'Missing required fields')
      }
      const payload = {
        email,
        type: accountType || 'checking', // 'checking' | 'savings',
        alias: alias || 'Primary Bank',
        country: country || 'US',
        routingNumber,
        rtpEligible: rtpEligible ?? true,
        firstName,
        lastName,
        account_number: accountNumber,
        city,
        state,
        zip,
        address1,
        address2,
        businessName,
        plaidAccessToken: "access-sandbox-67ecf532-f215-4af9-9bfe-42f2826e7595"
      }
      console.log("  payload  ", payload)
      let response;
      try {

        response = await axios.post(
          'https://api-sandbox.coinflow.cash/api/customer/v2/bankAccount',
          payload,
          {
            headers: {
              'Authorization': "coinflow_sandbox_5db9172a9972423d9636de12667e107c_49627992163e40f78fec4564576c3cd2", // config.get('coinflow.apiKey'),
              'x-coinflow-auth-user-id': userId.toString(),
              'Content-Type': 'application/json',
            }
          }
        )
        console.log("  response   response  ", response)

      } catch (error) {
        console.log("  error   error ", error)
      }
      return {
        success: true,
        response: response.data,
        message: 'Bank account successfully added to Coinflow'
      }

    } catch (error) {
      Logger.error('Error in AddCoinflowBankAccountService', { exception: error })
      throw new AppError(Errors.INTERNAL_ERROR)
    }
  }
}
