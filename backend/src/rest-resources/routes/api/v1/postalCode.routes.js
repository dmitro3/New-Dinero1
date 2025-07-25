import express from 'express'
import postalCodeHandler from '@src/rest-resources/controllers/postalCode.controller'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getCasinoTransactionsSchema } from '@src/json-schemas/favorites/getCasinoTransactions'
import { postalClaimRequestSchema } from '@src/json-schemas/postalCode/postalClaimRequest'
import { getRecentBigWinsSchema } from '@src/json-schemas/favorites/getRecentBigWins'

const args = { mergeParams: true }
const postalCodeRouter = express.Router(args)

postalCodeRouter.route('/').get(contextMiddleware(false), isUserAuthenticated, postalCodeHandler.getPostalCode)
postalCodeRouter.route('/claim-request').post(contextMiddleware(true), isUserAuthenticated, requestValidationMiddleware(postalClaimRequestSchema), postalCodeHandler.claimPostalCodeRequest)

export { postalCodeRouter }