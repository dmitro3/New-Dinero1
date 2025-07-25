import express from 'express'

import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import SpinWheelController from '@src/rest-resources/controllers/spinWheel.controller'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
const args = { mergeParams: true }
const spinWheelRouter = express.Router(args)

spinWheelRouter
  .route('/get-list')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isUserAuthenticated,
    SpinWheelController.getSpinWheelList,
    responseValidationMiddleware({})
  )

spinWheelRouter
  .route('/generate-index')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isUserAuthenticated,
    SpinWheelController.generateSpinWheelIndex,
    responseValidationMiddleware({})
  )

// spinWheelRouter
//   .route('/updateWallet')
//   .get(
//     requestValidationMiddleware({}),
//     contextMiddleware(true),
//     isUserAuthenticated,
//     SpinWheelController.updateWalletBalance,
//     responseValidationMiddleware({})
//   )
export default spinWheelRouter
