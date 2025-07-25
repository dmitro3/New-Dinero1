import { sendResponse } from '@src/helpers/response.helpers'
import { GetAllPackagesHandler } from '@src/services/package'

export default class PackageController {
  static async getAllPackages (req, res, next) {
    try {
      const data = await GetAllPackagesHandler.execute(req.query, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
