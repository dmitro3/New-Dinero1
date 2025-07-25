import CryptoJS from 'crypto-js'
import encode from 'crypto-js/enc-hex'

import config from '@src/configs/app.config'
import { Errors } from '@src/errors/errorCodes'

export const validateSignature = async (req, res, next) => {
  const token = CryptoJS.HmacMD5(req.body, config.get('microHandler.accessToken')).toString(encode)

  if (token !== req.headers['micro-service-request-sign']) {
    return next(Errors.INTERNAL_ERROR)
  }

  next()
}
