import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import { Op } from 'sequelize'

import db from '@src/db/models'
import { getAll } from '../helper/crud'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'
import { STATUS_VALUE } from '@src/utils/constant'

export class GetDocumentLabelHandler extends BaseHandler {
   async run () {
    const { user } = this.args

  
      let query = { isRequired: true }

      if (user.documentLabels) {
        if (user.kycStatus === STATUS_VALUE.RE_REQUESTED) {
          query = { documentLabelId: { [Op.in]: user.documentLabels } }
        } else {
          query = { [Op.or]: { ...query, documentLabelId: { [Op.in]: user.documentLabels } } }
        }
      }

      const documentLabel = await getAll({
        model: db.DocumentLabel,
        data: query,
        attributes: ['documentLabelId', 'name']
      })

      if (!documentLabel) throw new AppError(Errors.DOCUMENT_LABELS_NOT_FOUND)

      return { documentLabel, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
