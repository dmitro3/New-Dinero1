import { sendResponse } from '@src/helpers/response.helpers'
import { AvailFaucetHandler, GetFaucetHandler } from '@src/services/faucet'

export default class FaucetController {

  static async getFaucets (req, res, next) {
    try {
      const data = await GetFaucetHandler.execute({...req.body,...req.query}, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async awailFaucets (req, res, next) {
    try {
      const data = await AvailFaucetHandler.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
