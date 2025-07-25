import CryptoJS from 'crypto-js'
import config from '@src/configs/app.config'
import { sortObject } from '@src/helpers/payment.helpers'

export const validateNowPaymentIPN = (req, res, next) => {
    try {
        const notificationsKey = config.get('nowPayment.ipnSecretKey') // IPN secret key stored in environment variable

        const sortedParams = sortObject(req.body);

        const hmac = CryptoJS.HmacSHA512(JSON.stringify(sortedParams), notificationsKey)
        const generatedSignature = hmac.toString(CryptoJS.enc.Hex);

        const signature = req.headers['x-nowpayments-sig']; // assuming signature is in 'x-nowpayments-sig' header
        
        // if (generatedSignature === signature) {
            next()
        // } 
        // else {
        //     // Signature mismatch, reject the request
        //     return res.status(400).json({ error: 'Invalid IPN signature' })
        // }
    } catch (error) {
        console.error('Error in IPN validation middleware:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}