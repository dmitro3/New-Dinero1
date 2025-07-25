import { veriffConfig } from '@src/configs/veriff.config';
import { AppError } from '@src/errors/app.error';
import { Errors } from '@src/errors/errorCodes';
import { createSignature } from '@src/helpers/veriff.helpers';
import { Axios } from 'axios';



export class VeriffAxios extends Axios {
  constructor(headers = {}) {
    super({
      baseURL: veriffConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': veriffConfig.apiKey,
        ...headers,
      },
    });
  }

  static createInstance(headers = {}) {
    return new VeriffAxios(headers);
  }

  static async handleResponse(promise) {
    try {
      const response = await promise;
      const result = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      if (result.status === 'success') {
        return { success: true, result };
      }

      throw new AppError(result.data?.errors || Errors.UNKNOWN_ERROR);
    } catch (error) {
      throw new AppError(Errors.SERVICE_UNAVAILABLE, error.message || error);
    }
  }

  static async initVeriff(payload) {
    const veriff = VeriffAxios.createInstance();
    const response = await veriff.post('/v1/sessions', JSON.stringify(payload));
    console.log(response, "===================================")
    return VeriffAxios.handleResponse(response);
  }

  static async getVeriffDocuments(veriffID) {
    const headers = {
      'X-HMAC-SIGNATURE': `${createSignature({ payload: veriffID })}`,
    };
    const veriff = VeriffAxios.createInstance(headers);
    const response = veriff.get(`/v1/sessions/${veriffID}/media`);
    return VeriffAxios.handleResponse(response);
  }
}
