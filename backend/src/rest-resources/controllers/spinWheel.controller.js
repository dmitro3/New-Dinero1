import { GenerateSpinHandler, GetSpinWheelListHandler } from '@src/services/spinWheel'
import { sendResponse } from '@src/helpers/response.helpers'
// import { UpdateWalletBalanceHandler } from '@src/services/spinWheel/updateWalletBalance'

export default class SpinWheelController {
  static async getSpinWheelList (req, res, next) {
    try {
      const data = await GetSpinWheelListHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async generateSpinWheelIndex (req, res, next) {
    try {
      const data = await GenerateSpinHandler.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  // static async updateWalletBalance (req, res, next) {
  //   try {
  //     const data = await UpdateWalletBalanceHandler.execute({ ...req.body, ...req.query }, req.context)
  //     sendResponse({ req, res, next }, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}
