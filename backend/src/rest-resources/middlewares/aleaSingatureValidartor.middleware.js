import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants';
import config from 'config';
import crypto from 'crypto';

export const verifySignatureMiddleware = (req, res, next) => {
  try {
    const { signature, ...request } = req.body;

    if (!signature) return ALEA_ERROR_TYPES.INVALID_SIGNATURE

    let str;

    if (request.type === 'BALANCE') {
      const { casinoSessionId, currency, gameId, integratorId, softwareId } = request;
      str = `${casinoSessionId}${currency}${gameId}${integratorId}${softwareId}${config.get('alea.secret_key')}`;
    } else {
      const { stringData } = request;
      if (!stringData) return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      str = `${stringData}${config.get('alea.secret_key')}`;
    }

    const computedSignature = `SHA-512=${crypto
      .createHash('sha512')
      .update(str)
      .digest('hex')}`;

    if (computedSignature !== signature) return ALEA_ERROR_TYPES.INVALID_SIGNATURE

    next();
  } catch (error) {
    return ALEA_ERROR_TYPES.INVALID_SIGNATURE
  }
};
