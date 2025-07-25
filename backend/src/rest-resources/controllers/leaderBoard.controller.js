import { sendResponse } from '@src/helpers/response.helpers'
import { GetLeaderBoardHandler, GetTopWinnersHandler, GetRecentBigWinsHandler } from '@src/services/leaderBoard'

export default class leaderBoardController {
  static async getLeaderBoardHandler (req, res, next) {
    try {
      const data = await GetLeaderBoardHandler.execute(req.query)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getTopWinnersHandler (req, res, next) {
    try {
      const data = await GetTopWinnersHandler.execute(req.query)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getRecentBigWins (req, res, next) {
    try {
      const data = await GetRecentBigWinsHandler.execute(req.query)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
