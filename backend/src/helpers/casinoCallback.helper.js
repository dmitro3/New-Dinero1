import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import _ from 'lodash'

export const sendCasinoCallbackResponse = ({ req, res, next }, data) => {
  res.payload = data
  if(data?.statusCode)
    res.status(data.statusCode).json({...data})
  res.status(200).json({ ...data })
}

export const sendCasinoErrorResponse = ({ req, res, next }, error) => {
  if (error) {
    const { status, ...result } = error
    res.payload = result
    const statusCode = status ?? 200
    res.status(statusCode).json({ ...res.payload })
  } else {
    res.status(200).json(ALEA_ERROR_TYPES.INTERNAL_ERROR)
  }
}
