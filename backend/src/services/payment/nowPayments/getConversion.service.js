import config from '@src/configs/app.config';
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from '@src/libs/logicBase';
import axios from 'axios';

export class GetCurrencyConversionService extends BaseHandler {
    async run() {
        try {
            const resConfig = {
                method: 'get',
                maxBodyLength: Infinity,
                url: config.get('nowPayment.url') + '/v1/estimate?amount=' + this.args.amount + '&currency_from=' + this.args.convertFrom + '&currency_to=' + this.args.convertTo,
                headers: {
                    'x-api-key': config.get('nowPayment.apiKey')
                }
            }
            const response = await axios(resConfig)
            // return response.data
            return response.data.estimated_amount

        } catch (error) {
            console.log(error)
            throw new AppError(Errors.INTERNAL_SERVER_ERROR)
        }
    }
}
