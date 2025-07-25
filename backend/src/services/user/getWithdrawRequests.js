import db from '@src/db/models'
import { AppError } from "@src/errors/app.error"
import { Errors } from "@src/errors/errorCodes"
import { BaseHandler } from '@src/libs/logicBase'
import { filterByDate, pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'number'
    },
    limit: {
      type: ['string', 'null']
    },
    pageNo: {
      type: ['string', 'null']
    },
    status: {
      enum: ['0', '5', '2', 'null', '']
    },
    startDate: {
      type: ['string', 'null']
    },
    endDate: {
      type: ['string', 'null']
    },
    search: {
      type: ['string', 'null']
    }
  },
  required: ['id']
}



export class GetWithdrawRequestsHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { limit, pageNo, status, id, startDate, endDate, search } = this.args

  
      const { page, size } = pageValidation(pageNo, limit)
      let query = { userId: id }

      if (status && (status !== '' || status !== null)) query = { ...query, status }
      if (startDate || endDate) query = filterByDate(query, startDate, endDate)
      if (search) query = { ...query, [Op.or]: [{ paymentProvider: { [Op.iLike]: `%${search}%` } }, { transactionId: { [Op.iLike]: `%${search}%` } }] }

      const withdrawRequest = await db.WithdrawRequest.findAndCountAll({
        order: [['createdAt', 'DESC']],
        where: query,
        limit: size,
        offset: ((page - 1) * size),
        attributes: ['withdrawRequestId', 'transactionId', 'userId', 'createdAt', 'updatedAt', 'status', 'amount', 'paymentProvider']
      })

      if (!withdrawRequest) throw new AppError(Errors.WITHDRAW_REQUEST_NOT_FOUND)

      return { withdrawRequest, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
