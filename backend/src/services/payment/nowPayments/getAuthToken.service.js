import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import config from '@src/configs/app.config'
import axios from 'axios';
import { BaseHandler } from '@src/libs/logicBase'


export class GetAuthenticationTokenService extends BaseHandler {
    async run() {
        try {
            const options = JSON.stringify({
                email: config.get('nowPayment.email'),
                password: config.get('nowPayment.password'),
            })
            try {
                const response = await axios({
                    method: 'POST',
                    url: `${config.get('nowPayment.url')}/v1/auth`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: options
                })
                if (!response) throw new AppError(Errors.INTERNAL_SERVER_ERROR)
                return { result: response.data }

            }
            catch (error) {
                throw new AppError(Errors.INTERNAL_SERVER_ERROR)
            }
        } catch (error) {
            throw new AppError(Errors.INTERNAL_SERVER_ERROR)
        }
    }
}