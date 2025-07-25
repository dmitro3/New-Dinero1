import { sendResponse } from "@src/helpers/response.helpers"
import { GetPromotionsHandler, GetBannerDownloadHandler, GetBannersHandler } from "@src/services/banner"

export default class BannerController {
  static async getPromotions(req, res, next) {
    try {
      const data = await GetPromotionsHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getBanners(req, res, next) {
    try {
      const data = await GetBannersHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getBannerDownload(req, res, next) {
    try {
      const data = await GetBannerDownloadHandler.execute({ ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
