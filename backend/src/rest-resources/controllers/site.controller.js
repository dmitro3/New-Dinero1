import { sendResponse } from '@src/helpers/response.helpers'
import { GetCmsInfoHandler, GetCmsPageHandler } from '@src/services/cms'
import { SendPromotionsHandler } from '@src/services/settings/sendPromotions.service'
import {
  GetBannersHandler,
  GetCurrencyHandler,
  GetLanguageHandler, GetReviewsHandler,
  SiteDetailHandler, GetSocialMediaLinksService
} from '@src/services/site'
import { GetStatesHandler } from '@src/services/site/getStates'

export default class SiteController {
  static async getSiteDetail (req, res, next) {
    try {
      const data = await SiteDetailHandler.execute(req.body)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async getSocialMediaLinks (req, res, next) {
    try {
      const data = await GetSocialMediaLinksService.execute(req.body)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async sendPromotion (req, res, next) {
    try {
      const data = await SendPromotionsHandler.execute(req.body)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  // static async getAllCountry (req, res, next) {
  //   try {
  //     const data = await GetAllCountriesHandler.execute()
  //     sendResponse({ req, res, next }, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async getStates (req, res, next) {
    try {
      const data = await GetStatesHandler.execute(req.body)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getCmsPage (req, res, next) {
    try {
      const data = await GetCmsPageHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getCmsInfo (req, res, next) {
    try {
      const data = await GetCmsInfoHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  // static async getLanguages (req, res, next) {
  //   try {
  //     const data = await GetLanguageHandler.execute(req.body)
  //     sendResponse({ req, res, next }, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async getCurrency (req, res, next) {
    try {
      const data = await GetCurrencyHandler.execute(req.query)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  // static async getReviews (req, res, next) {
  //   try {
  //     const data = await GetReviewsHandler.execute(req.body)
  //     sendResponse({ req, res, next }, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // static async getLanguageSupportKeys (req, res, next) {
  //   try {
  //     const data = await GetLanguageSupportHandler.execute({ ...req.query, ...req.body, userId: userId(req) })
  //     sendResponse({ req, res, next }, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // static async getSettings (req, res, next) {
  //   try {
  //     const data = await GetGlobalSettingsHandler.execute(req.body)
  //     sendResponse({ req, res, next }, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async getBanners (req, res, next) {
    try {
      const data = await GetBannersHandler.execute(req.query)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
