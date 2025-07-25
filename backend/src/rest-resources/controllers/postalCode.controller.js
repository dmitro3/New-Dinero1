import { sendResponse } from '@src/helpers/response.helpers'
import { ClaimPostalCodeRequestHandler, GetPostalCodeHandler } from '@src/services/postalCode'

export default class postalCodeHandler {
    static async claimPostalCodeRequest(req, res, next) {
        try {
            const data = await ClaimPostalCodeRequestHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async getPostalCode(req, res, next) {
        try {
            const data = await GetPostalCodeHandler.execute({ ...req.body, ...req.query })
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
}
