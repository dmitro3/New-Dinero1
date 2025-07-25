import express from 'express'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import FaucetController from '@src/rest-resources/controllers/faucet.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import { awailFaucetSchema } from '@src/json-schemas/faucet/availFaucet.schema'
import { getFaucetSchema } from '@src/json-schemas/faucet/getFaucet.schema'

const args = { mergeParams: true }
const faucetRouter = express.Router(args)

faucetRouter.route('/')
  .get(contextMiddleware(false), requestValidationMiddleware(getFaucetSchema),isUserAuthenticated, FaucetController.getFaucets)
  .post(contextMiddleware(true), requestValidationMiddleware(awailFaucetSchema),isUserAuthenticated, FaucetController.awailFaucets)

export { faucetRouter }
