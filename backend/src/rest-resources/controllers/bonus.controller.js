import { sendResponse } from '@src/helpers/response.helpers'
import {
  AvailBonusHandler,
  CancelBonusHandler,
  ClaimBonusDropHandler,
  GetAllBonusHandler, GetBonusDetailHandler,
  GetDropBonusesHandler,
  GetUserBonusHandler
} from '@src/services/bonus'
import { ClaimWelcomeBonusHandler } from '@src/services/bonus/welcomeBonus/claimWelcomeBonus.handler'
import { GetWelcomeBonusHandler } from '@src/services/bonus/welcomeBonus/getWelcomeBonus.handler'
import { userId } from '@src/utils/common'

export default class BonusController {
  static async getAllBonus(req, res, next) {
    try {
      const data = await GetAllBonusHandler.execute({ ...req.body, ...req.query, userId: userId(req) })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getBonusDetail(req, res, next) {
    try {
      const data = await GetBonusDetailHandler.execute({ ...req.body, ...req.query, userId: userId(req) })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  // Bonus Drop
  static async GetDropBonus(req, res, next) {
    try {
      const data = await GetDropBonusesHandler.execute({ ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  static async claimDropbonus(req, res, next) {
    try {
      const data = await ClaimBonusDropHandler.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  // Welcome Bonus
  static async getWelcomebonus(req, res, next) {
    try {
      const data = await GetWelcomeBonusHandler.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async claimWelcomebonus(req, res, next) {
    try {
      const data = await ClaimWelcomeBonusHandler.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async availBonus(req, res, next) {
    try {
      const data = await AvailBonusHandler.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  static async getUserBonus(req, res, next) {
    try {
      const data = await GetUserBonusHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async cancelBonus(req, res, next) {
    try {
      const data = await CancelBonusHandler.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

}
