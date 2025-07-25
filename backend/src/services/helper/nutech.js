import md5 from 'md5'
import config from '@src/configs/app.config'
import crypto from 'node:crypto'
import urlencode from 'urlencode'

// Signature creation
export const createSignature = (req) => {
  try {
    let rawSign = req

    rawSign = Object.fromEntries(Object.entries(rawSign).sort())
    rawSign = Object.entries(rawSign).map(([key, value]) => `${key}=${value}`).join('&')
    rawSign = rawSign + '&key=' + config.get('nutech.secretKey')
    rawSign = md5(rawSign).toUpperCase()
    const cipher = crypto.createCipheriv('aes-128-cbc', config.get('nutech.secretKey'), config.get('nutech.offset'))
    let cryptoString = cipher.update(rawSign, 'utf8', 'base64')
    cryptoString += cipher.final('base64')
    const midstring1 = config.get('nutech.offset') + cryptoString
    const midstring2 = crypto.createHmac('sha256', config.get('nutech.secretKey')).update(midstring1).digest('hex')
    const midstring3 = midstring2 + midstring1
    const sign = urlencode(midstring3)

    return sign
  } catch (error) {
    console.log(error, 'err')
  }
}
