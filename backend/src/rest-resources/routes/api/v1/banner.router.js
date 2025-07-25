import express from 'express'
import BannerController from '@src/rest-resources/controllers/banner.controller'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getPromotionsSchema } from '@src/json-schemas/banner/getPromotions.schema'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import { getBannersSchema } from '@src/json-schemas/banner/getBanners.schema'

const args = { mergeParams: true }
const bannerRouter = express.Router(args)

bannerRouter.route('/get-promotions').get(contextMiddleware(false), requestValidationMiddleware(getPromotionsSchema), BannerController.getPromotions)
// bannerRouter.route('/').get(contextMiddleware(false), requestValidationMiddleware(getBannersSchema), BannerController.getBanners)
bannerRouter.route('/banner-download').get(isUserAuthenticated, contextMiddleware(false), BannerController.getBannerDownload)

export { bannerRouter }
