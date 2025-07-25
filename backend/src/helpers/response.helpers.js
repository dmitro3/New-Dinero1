import _ from 'lodash'
import BaseError from '@src/errors/base.error'
import { extractErrorAttributes } from '@src/utils/error.utils'
import { GSOFT_STATUS } from '@src/utils/constants/casino.constants'
import { Errors } from '@src/errors/errorCodes'

export const sendResponse = ({ req, res, next }, data) => {
  if (data && !_.isEmpty(data)) {
    res.payload = { data, errors: [] }
    next()
  } else {
    next(Errors.INTERNAL_ERROR)
  }
}

export const sendSocketResponse = async ({ reqData, resCallback }, { data, defaultError }) => {
  const transaction = reqData.context.sequelizeTransaction
  if (data && !_.isEmpty(data)) {
    if (transaction) await transaction.commit();
    return resCallback({ data: data, errors: [] })
  } else {
    if (transaction) await transaction.rollback()
    const responseError = new BaseError({ ...defaultError })
    return resCallback({ data: {}, errors: [responseError] })
  }
}


export const sendGSoftResponse = ({ req, res, next }, { successful, result, serviceErrors, defaultError }) => {
  if (successful && !_.isEmpty(result)) {
    console.log(result)
    const status = GSOFT_STATUS[result.code] || { message: 'Unknown error', code: result.code };

    res.payload = {
      ...result,
      apiversion: req.query?.apiversion,
      ...status
    };

    res.status(200).json(res.payload);
  }
  else {
    if (!_.isEmpty(serviceErrors)) {
      res.status(200).json({ ...GSOFT_STATUS.TECHNICAL_ERROR, apiversion: req.query?.apiversion })
    }
  }
}

