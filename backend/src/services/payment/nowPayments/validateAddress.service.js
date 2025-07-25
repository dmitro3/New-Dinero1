import config from '@src/configs/app.config'
import { Errors } from "@src/errors/errorCodes";
import { AppError } from "@src/errors/app.error";
import axios from 'axios';
import { BaseHandler } from '@src/libs/logicBase';

export class ValidateWalletAddress extends BaseHandler {
    async run() {

      try {
            const data = JSON.stringify({
                address: this.args.address,
                currency: this.args.currency,
                extra_id: null
            })
            const resConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: config.get('nowPayment.url') + '/v1/payout/validate-address',
                headers: {
                    'x-api-key': config.get('nowPayment.apiKey'),
                    'Content-Type': 'application/json'
                },
                data
            }
            const response = await axios(resConfig)

            return response.data
        } catch (err) {
            throw new AppError(Errors.INVALID_CRYPTO_ADDRESS);
        }
    }
 }
