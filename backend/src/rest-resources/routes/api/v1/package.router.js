import express from 'express'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import PackageController from '@src/rest-resources/controllers/package.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getAllPackagesSchema } from '@src/json-schemas/package/getAllPackages.schema'
const args = { mergeParams: true }
const packageRouter = express.Router(args)

packageRouter.route('/')
  .get(contextMiddleware(false), requestValidationMiddleware(getAllPackagesSchema), PackageController.getAllPackages)

export { packageRouter }
