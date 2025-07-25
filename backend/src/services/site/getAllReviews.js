import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import { getAll } from '../helper/crud'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'

export class GetReviewsHandler extends BaseHandler {
   async run () {
  
      const reviews = await getAll({
        model: db.Review,
        data: { status: true }
      })

      if (!reviews) throw new AppError(Errors.REVIEW_NOT_FOUND)

      return { reviews, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
