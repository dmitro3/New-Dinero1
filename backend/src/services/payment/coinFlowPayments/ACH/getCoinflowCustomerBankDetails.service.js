import config from '@src/configs/app.config'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import axios from 'axios'

export class GetCoinflowUserBankDetailsService extends BaseHandler {
  async run () {
    try {
      const { userId, lastFour } = this.args
      let sessionKeyRes
      try {
        sessionKeyRes = await axios({
          method: 'GET',
          url: `${config.get('coinFlow.baseUrl')}/api/auth/session-key`,
          headers: {
            'x-coinflow-auth-user-id': String(userId),
            'Authorization': `${config.get('coinFlow.apiKey')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })
      } catch (error) {
        console.log('Error fetching Coinflow session key', { exception: error })
        throw new AppError(Errors.INTERNAL_ERROR, 'Unable to retrieve session key from Coinflow')
      }

      const sessionKey = sessionKeyRes?.data?.key

      if (!sessionKey) {
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, 'Session key not received from Coinflow')
      }
      // Step 2: Fetch customer details using session key
      let customerRes
      try {
        customerRes = await axios.get(`${config.get('coinFlow.baseUrl')}/api/customer/v2`, {
          headers: {
            accept: 'application/json',
            'x-coinflow-auth-session-key': sessionKey,
            Authorization: `${config.get('coinFlow.apiKey')}`,
          },
        })
      } catch (error) {
        console.log('Error fetching Coinflow customer data', { exception: error })
        throw new AppError(Errors.INTERNAL_ERROR)
      }
      const customerData = customerRes?.data?.customer
      if (!customerData || !Array.isArray(customerData.bankAccounts)) {
        throw new AppError(Errors.INTERNAL_ERROR)
      }
      const matchingAccount = customerData.bankAccounts.find(
        (account) => account.last4 === lastFour
      )
      if (!matchingAccount) {
        throw new AppError(Errors.ACCOUNT_DETAILS_NOT_FOUND)
      }
      const token = matchingAccount.token

      if (!token) {
        throw new AppError(Errors.INTERNAL_ERROR)
      }

      return {
        success: true,
        token: token,
        // customer: customerRes.data.customer,
        customer: customerRes.data,
        message: 'Coinflow customer retrieved successfully',
      }
    } catch (error) {
      Logger.error('Unhandled error in GetCoinflowUserBankDetailsService', { exception: error })
      throw new AppError(Errors.INTERNAL_ERROR)
    }
  }
}
