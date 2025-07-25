import { sendResponse } from '@src/helpers/response.helpers'
import Logger from '@src/libs/logger'
import {
  CreatePaymentService, GetPaymentIPNService, GetPaymentCurrencyService, GetCurrencyConversionService, GetCoinFlowUserSavedPaymentTokenService,
  CreateCoinFlowCardPaymentService, CreateCoinFlowExistingAccountPaymentService, CoinflowWebhookService, CreatePlaidLinkTokenService,
  ExchangePlaidPublicTokenService, CreateCoinFlowAchPaymentService, GetPlaidBankAccountDetailsService, AddCoinflowBankAccountService,
  GetCoinflowUserBankDetailsService, GetCoinFlowSessionKeyService, CreateWebhookDataService, CreateCoinFlowKycService, CreateCoinflowBankAuthUrlService,
  GetCoinFlowUserWithdrawalAccountsService, CreateCoinFlowDebitCardWithdrawalService
} from '@src/services/payment'
import { CreateWithdrawalRequestService } from '@src/services/payment/createWithdrawalRequest.service'
export default class PaymentController {
  /**
   * Controller method to handle the request for /hello path
   *
   * @static
   * @param {object} req - object contains all the request params sent from the client
   * @param {object} res - object contains all the response params sent to the client
   * @param {function} next - function to execute next middleware
   * @memberof PaymentController
   */
  static async createPayment (req, res, next) {
    try {
      const data = await CreatePaymentService.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async createCoinFlowPayment (req, res, next) {
    try {
      const data = await CreateCoinFlowCardPaymentService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async createPlaidLinkToken (req, res, next) {
    try {
      const data = await CreatePlaidLinkTokenService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async getCoinFlowUserWithdrawalAccounts (req, res, next) {
    try {
      const data = await GetCoinFlowUserWithdrawalAccountsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async addCoinflowBankAccount (req, res, next) {
    try {
      const data = await AddCoinflowBankAccountService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async createCoinFlowDebitCardWithdrawal (req, res, next) {
    try {
      const data = await CreateCoinFlowDebitCardWithdrawalService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async exchangePlaidPublicToken (req, res, next) {
    try {
      const data = await ExchangePlaidPublicTokenService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async createCoinFlowAchPayment (req, res, next) {
    try {
      const data = await CreateCoinFlowAchPaymentService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async createCoinflowBankAuthUrl (req, res, next) {
    try {
      const data = await CreateCoinflowBankAuthUrlService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async getCoinflowUserBankDetails (req, res, next) {
    try {
      const data = await GetCoinflowUserBankDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async getCoinFlowSessionKey (req, res, next) {
    try {
      const data = await GetCoinFlowSessionKeyService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async createWebhookData (req, res, next) {
    try {
      const data = await CreateWebhookDataService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async getPlaidBankAccountDetails (req, res, next) {
    try {
      const data = await GetPlaidBankAccountDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async coinflowAcceptPaymentWebhook (req, res, next) {
    try {
      const data = await CoinflowWebhookService.execute({ ...req.body, authHeader: req.get('Authorization') }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async createCoinFlowExistingAccountPayment (req, res, next) {
    try {
      const data = await CreateCoinFlowExistingAccountPaymentService.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async createCoinFlowKyc (req, res, next) {
    try {
      const data = await CreateCoinFlowKycService.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getCoinFlowUserSavedToken (req, res, next) {
    try {
      const data = await GetCoinFlowUserSavedPaymentTokenService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getIPNPaymentStatus (req, res, next) {
    try {
      // Logger.info("===getIPNPaymentStatus===== ", { message: JSON.stringify(req.body) })
      const data = await GetPaymentIPNService.execute(req.body, req.context)
      // console.log(result, successful, errors, "===")
      sendResponse({ req, res, next }, data)
      // res.json(result.result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async getCurrencies (req, res, next) {
    try {
      const data = await GetPaymentCurrencyService.execute(req.query, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getConversion (req, res, next) {
    try {
      const data = await GetCurrencyConversionService.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Controller method to handle the withdraw request
   *
   * @static
   * @param {object} req - object contains all the request params sent from the client
   * @param {object} res - object contains all the response params sent to the client
   * @param {function} next - function to execute next middleware
   * @memberof PaymentController
   */
  static async createWithdrawalRequest (req, res, next) {
    try {
      const data = await CreateWithdrawalRequestService.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

}
