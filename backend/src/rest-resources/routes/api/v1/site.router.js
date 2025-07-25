import SiteController from '@src/rest-resources/controllers/site.controller'
import express from 'express'
import { basicAuthentication } from '@src/rest-resources/middlewares/basicAuthentication.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getBannersSchema } from '@src/json-schemas/banner/getBanners.schema'
import { getCmsPageSchema } from '@src/json-schemas/site/getCmsPage.schema'
import { sendPromotionSchema } from '@src/json-schemas/site/sendPromotion.schema'

const args = { mergeParams: true }
const siteRouter = express.Router(args)

siteRouter.route('/banners').get(requestValidationMiddleware(getBannersSchema), SiteController.getBanners)
siteRouter.route('/get-currency').get(SiteController.getCurrency)
siteRouter.route('/cms-page').get(requestValidationMiddleware(getCmsPageSchema), SiteController.getCmsPage)
siteRouter.route('/get-cms-info').get(SiteController.getCmsInfo)
siteRouter.route('/states').get(SiteController.getStates)

siteRouter.route('/send-promotion').post(requestValidationMiddleware(sendPromotionSchema), basicAuthentication, SiteController.sendPromotion)

siteRouter.route('/site-detail').get(SiteController.getSiteDetail)
siteRouter.route('/social-media-links').get(SiteController.getSocialMediaLinks)

export { siteRouter }
