import express from 'express'

import VipTierController from '@src/rest-resources/controllers/vipTier.controller'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getVipTiersSchema } from '@src/json-schemas/vipTier/getVipTiers'

const args = { mergeParams: true }
const vipTierRouter = express.Router(args)

vipTierRouter.route('/')
  .get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware(getVipTiersSchema), VipTierController.getVipTiers)

export { vipTierRouter }
