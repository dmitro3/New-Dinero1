import { sendGSoftResponse, sendResponse } from '@src/helpers/response.helpers'
import PlaceBetHandler from '@src/services/callback/gsoft/bet.service'
import GetAccountHandler from '@src/services/callback/gsoft/getAccount.service'
import GetBalanceHandler from '@src/services/callback/gsoft/getBalance.service'
import RollbackHandler from '@src/services/callback/gsoft/rollback.service'
import StartGameHandler from '@src/services/callback/gsoft/startGame.service'
import WagerAndResultHandler from '@src/services/callback/gsoft/wagerAndResult.service'
import ResultHandler from '@src/services/callback/gsoft/win.service'
import {
  AddFavoriteGameHandler,
  GetAllGamesHandler,
  GetCasinoGamesHandler,
  GetCasinoTransactionHandler,
  GetFavoriteGamesHandler,
  GetGameCategoryHandler,
  GetGameProvidersHandler,
  GetLeaderBoardDetails,
  RemoveFavoriteGameHandler
} from '@src/services/casino'
import { LoadOneGameHubGamesHandler } from '@src/services/providers/1GameHub/loadOneGameHubGames.service'
import { GenericGameLaunchHandler } from '@src/services/common/gameLaunch.service'
import { getRequestIP, userId } from '@src/utils/common'
import { GSOFT_CALLBACK_METHODS } from '@src/utils/constants/casino.constants'

export class CasinoController {
  static async getGameCategory(req, res, next) {
    try {
      const data = await GetGameCategoryHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getCasinoGames(req, res, next) {
    try {
      const data = await GetCasinoGamesHandler.execute({ ...req.query, ...req.body, ipAddress: getRequestIP(req) })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  static async getGameProvider(req, res, next) {
    try {
      const data = await GetGameProvidersHandler.execute({ ...req.query, ...req.body, userId: userId(req) })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async addFavoriteGame(req, res, next) {
    try {
      const data = await AddFavoriteGameHandler.execute(req.body)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async removeFavoriteGame(req, res, next) {
    try {
      const data = await RemoveFavoriteGameHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getFavoriteGame(req, res, next) {
    try {
      const data = await GetFavoriteGamesHandler.execute({ ...req.body, ...req.query, })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getCasinoTransactions(req, res, next) {
    try {
      const data = await GetCasinoTransactionHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getAllGames(req, res, next) {
    try {
      const data = await GetAllGamesHandler.execute({ ...req.query, ...req.body, ipAddress: getRequestIP(req) })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  static async genericGamelaunch(req, res, next) {
    try {
      const data = await GenericGameLaunchHandler.execute({ ...req.query, ...req.body, ipAddress: getRequestIP(req) })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getLeaderBoardDetails(req, res, next) {
    try {
      const data = await GetLeaderBoardDetails.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async syncOneGameHubGames(req, res, next) {
    try {
      const data = await LoadOneGameHubGamesHandler.execute({}, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}


export class GsoftCasinoController {
  static async startGame(req, res, next) {
    try {
      const data = await StartGameHandler.execute({ ...req.query, ...req.body })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async casinoCallback(req, res, next) {
    try {
      if (req.query.request === GSOFT_CALLBACK_METHODS.GET_ACCOUNT) {
        const data = await GetAccountHandler.execute(req.query)
        sendGSoftResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      }
      if (req.query.request === GSOFT_CALLBACK_METHODS.GET_BALANCE) {
        const data = await GetBalanceHandler.execute(req.query)
        sendGSoftResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      }
      if (req.query.request === GSOFT_CALLBACK_METHODS.WAGER) {
        const data = await PlaceBetHandler.execute(req.query)
        sendGSoftResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      }
      if (req.query.request === GSOFT_CALLBACK_METHODS.RESULT) {
        const data = await ResultHandler.execute(req.query)
        sendGSoftResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      }
      if (req.query.request === GSOFT_CALLBACK_METHODS.ROLLBACK) {
        const data = await RollbackHandler.execute(req.query)
        sendGSoftResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      }
      if (req.query.request === GSOFT_CALLBACK_METHODS.WAGERANDRESULT) {
        const data = await WagerAndResultHandler.execute(req.query)
        sendGSoftResponse({ req, res, next }, { result, successful, serviceErrors: errors })
      }
    } catch (error) {
      next(error)
    }
  }
}


export class iconic21CasinoController {
  static async startGame(req, res, next) {
    try {
      const data = await StartGameHandler.execute({ ...req.query, ...req.body })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}