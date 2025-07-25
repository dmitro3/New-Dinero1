import config from '@src/configs/app.config'
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from '@src/libs/logicBase';
import axios from 'axios';


export class GetPaymentCurrencyService extends BaseHandler {
    async run() {
        try {
            const response = await axios({
                method: 'GET',
                url: config.get('nowPayment.url') + '/v1/currencies?fixed_rate=true',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': config.get('nowPayment.apiKey')
                },
            })

            if (!response) throw new AppError(Errors.PAYMENT_FAILED)
            const data = response.data.currencies
            return data

        } catch (error) {
            throw new AppError(Errors.INTERNAL_SERVER_ERROR)
        }
    }
}