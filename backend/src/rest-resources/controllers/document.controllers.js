import { Errors } from '@src/errors/errorCodes'
import { sendResponse } from '@src/helpers/response.helpers'
import { GetDocumentLabelHandler, GetUserDocumentHandler, UpdateDocumentHandler } from '@src/services/userDocument'
import { validateFile } from '@src/utils/common'
import { OK } from '@src/utils/constant'

export default class DocumentController {
  static async getDocumentLabels(req, res, next) {
    try {
      const data = await GetDocumentLabelHandler.execute(req.body)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getUserDocument(req, res, next) {
    try {
      const data = await GetUserDocumentHandler.execute(req.body)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async updateUserDocument(req, res, next) {
    try {
      const fileCheckResponse = validateFile(res, req.file)

      if (fileCheckResponse !== OK) {
        return next(Errors.INVALID_FILE)
      }

      const data = await UpdateDocumentHandler.execute({ ...req.body, document: req.file })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

}
