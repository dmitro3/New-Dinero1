import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import { GetPlaidBankAccountDetailsService } from '@src/services/payment/coinFlowPayments/ACH/getPlaidBankAccountDetails.service'
import { GetCoinflowUserBankDetailsService } from '@src/services/payment/coinFlowPayments/ACH/getCoinflowCustomerBankDetails.service'
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid'
const config = require('@src/configs/app.config');
import axios from 'axios'

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

// Map Plaid subtype to Coinflow-compatible type
function mapPlaidToCoinflowType (subtype) {
  switch (subtype) {
    case 'checking':
    case 'savings':
      return subtype
    case 'cash management':
    case 'money market':
    case 'prepaid':
    case 'cd':
      return 'checking' // choose what's appropriate — 'checking' is usually safest
    default:
      return 'checking'
  }
}


export class ExchangePlaidPublicTokenService extends BaseHandler {
  async run () {
    try {
      const { publicToken, userId } = this.args
      let response;
      try {

        response = await client.itemPublicTokenExchange({
          public_token: publicToken,
        })

      } catch (error) {
        console.log("  error  error ", error)
      }
      const { access_token, item_id } = response.data
      let accountDetails;
      if (access_token) {
        accountDetails = await GetPlaidBankAccountDetailsService.execute({ token: access_token })
      }
      if (accountDetails?.success === true) {
        const account = accountDetails.data.accounts.find(acc => acc.type === 'depository')
        const achNumber = accountDetails.data.numbers.ach.find(a => a.account_id === account.account_id)

        if (!account || !achNumber) throw new AppError(Errors.ACCOUNT_DETAILS_NOT_FOUND)
        const user = await db.User.findOne({
          where: { userId },
          include: [
            { model: db.UserDetails, as: 'userDetails' },
            { model: db.State, attributes: ['name'], required: false }
          ]
        })

        if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
        const zip = user.userDetails?.zip || '94105'
        const state = user.stateCode?.name || 'CA'
        const address = user.userDetails?.address || '123 Sandbox Lane'
        const addBankPayload = {
          type: account.subtype,
          // type: mapPlaidToCoinflowType(account.subtype),
          email: user.email,
          alias: account.name,
          country: 'US',
          routingNumber: achNumber.routing,
          rtpEligible: true,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city || 'Testville',
          state: state,
          zip: zip,
          account_number: achNumber.account,
          // businessName: user.businessName || 'Personal',
          address1: address,
          // address2: address,
          plaidAccessToken: access_token
        }

        let coinflowRes;
        try {
          coinflowRes = await axios.post(
            // 'https://api-sandbox.coinflow.cash/api/customer/v2/bankAccount',
            `${config.get('coinFlow.baseUrl')}/api/customer/v2/bankAccount`,
            addBankPayload,
            {
              headers: {
                // Authorization: `Bearer ${config.get('coinFlow.apiKey')}`,
                Authorization: `${config.get('coinFlow.apiKey')}`,
                'x-coinflow-auth-user-id': String(userId),
                'content-type': 'application/json'
              }
            }
          )
        } catch (error) {
          console.log(" coinflowRes  error  ", error)
        }

        const lastFour = achNumber.account.slice(-4);
        const { token } = await GetCoinflowUserBankDetailsService.execute({ userId, lastFour })

        const existingRecord = await db.PaymentDetail.findOne({
          where: {
            userId,
            token,
            lastFourDigits: String(lastFour),
            paymentType: 'ACH',
          },
        });

        let paymentDetails;

        if (existingRecord) {
          // Update the existing record
          await existingRecord.update({
            achAccessToken: access_token,
            hasCheckoutPermission: true,
            lastFourDigits: String(lastFour),
          });
          paymentDetails = existingRecord;
        } else {
          // Create a new record
          paymentDetails = await db.PaymentDetail.create({
            userId,
            token,
            hasCheckoutPermission: true,
            paymentType: 'ACH',
            achAccessToken: access_token,
            lastFourDigits: String(lastFour),
          });
        }

        return {
          success: true,
          // response: coinflowRes.data,
          // accountDetails: accountDetails.data,
          message: 'Bank account added successfully',
        }
      } else {
        throw new AppError(Errors.ACCOUNT_DETAILS_NOT_FOUND)
      }
    } catch (error) {
      console.log('Error in ExchangePlaidPublicTokenService', error)
      Logger.error('Error in ExchangePlaidPublicTokenService', { exception: error })
      throw new AppError(Errors.INTERNAL_ERROR)
    }
  }
}
