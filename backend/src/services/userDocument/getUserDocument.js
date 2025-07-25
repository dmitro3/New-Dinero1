import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'

export class GetUserDocumentHandler extends BaseHandler {
   async run () {
    const { id } = this.args

  
      const userDocument = await db.UserDocument.findAndCountAll({
        where: { userId: id },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'actionee', 'actionPerformedAt']
        }
      })

      if (!userDocument) throw new AppError(Errors.USER_DOCUMENTS_NOT_FOUND)

      return { userDocument, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
