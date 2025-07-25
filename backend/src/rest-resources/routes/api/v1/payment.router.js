import express from 'express'
import PaymentController from '@src/rest-resources/controllers/payment.controller'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
// import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import { validateNowPaymentIPN } from '@src/rest-resources/middlewares/validateIPN.middleware'
import { createPaymentSchema } from '@src/json-schemas/payment/createPayment.schema'
import { currencyConversionSchema } from '@src/json-schemas/payment/currencyConversion.schema'
import { getIPNPaymentStatusSchema } from '@src/json-schemas/payment/getIPNPaymentStatus.schema'
import { withdrawAmountsSchema } from '@src/json-schemas/payment/withdrawAmount.schema'

const paymentRouter = express.Router()

//Nowpayments
paymentRouter.route('/create-payment').post(requestValidationMiddleware(), requestValidationMiddleware(createPaymentSchema), isUserAuthenticated, contextMiddleware(true), PaymentController.createPayment)
paymentRouter.route('/get-payment-status').post(contextMiddleware(true), validateNowPaymentIPN, PaymentController.getIPNPaymentStatus)
paymentRouter.route('/withdraw-amount').post(contextMiddleware(true), requestValidationMiddleware(withdrawAmountsSchema), isUserAuthenticated, PaymentController.createWithdrawalRequest)

paymentRouter.route('/get-currencies').get(isUserAuthenticated, contextMiddleware(true), PaymentController.getCurrencies)
paymentRouter.route('/get-conversion').post(isUserAuthenticated, contextMiddleware(false), requestValidationMiddleware(currencyConversionSchema), PaymentController.getConversion)


// coin flow
// card
paymentRouter.route('/coin-flow/card/new').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.createCoinFlowPayment)
paymentRouter.route('/coin-flow/card/existing').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.createCoinFlowExistingAccountPayment)
paymentRouter.route('/coin-flow/user/token').get(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.getCoinFlowUserSavedToken)
paymentRouter.route('/coin-flow/webhooks/purchase').post(requestValidationMiddleware(), requestValidationMiddleware({}), contextMiddleware(true), PaymentController.coinflowAcceptPaymentWebhook)

paymentRouter.route('/coin-flow/ach/plaid/bank-account/details').get(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.getPlaidBankAccountDetails)
paymentRouter.route('/coin-flow/ach/plaid/link-token').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.createPlaidLinkToken)
paymentRouter.route('/coin-flow/ach/plaid/public-token/exchange').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.exchangePlaidPublicToken)
paymentRouter.route('/coin-flow/ach/add-bank-account').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.addCoinflowBankAccount)
paymentRouter.route('/coin-flow/ach/get-bank-details').get(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.getCoinflowUserBankDetails)
paymentRouter.route('/coin-flow/ach/payment').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.createCoinFlowAchPayment)
paymentRouter.route('/coin-flow/get-session-key').get(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(false), PaymentController.getCoinFlowSessionKey)
paymentRouter.route('/coin-flow/create-webhook-data').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.createWebhookData)

paymentRouter.route('/coin-flow/create-kyc').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.createCoinFlowKyc)
paymentRouter.route('/coin-flow/bank-auth-url').get(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(false), PaymentController.createCoinflowBankAuthUrl)
paymentRouter.route('/coin-flow/withdrawal/accounts').get(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(false), PaymentController.getCoinFlowUserWithdrawalAccounts)
paymentRouter.route('/coin-flow/withdrawal/cards').post(requestValidationMiddleware(), requestValidationMiddleware({}), isUserAuthenticated, contextMiddleware(true), PaymentController.createCoinFlowDebitCardWithdrawal)


export { paymentRouter }
