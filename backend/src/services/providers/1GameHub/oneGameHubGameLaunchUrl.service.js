import config from '@src/configs/app.config'
import ajv from '@src/libs/ajv'
import { BaseHandler } from '@src/libs/logicBase'
import { setCache } from '@src/libs/redis'
import { ONE_GAME_HUB_SESSION_PREFIX } from '@src/utils/constants/casinoProviders/oneGameHub.constants'
import { ONE_GAME_HUB_REQUEST_ACTIONS } from '@src/utils/constants/public.constants'
import dayjs from 'dayjs'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import axios from 'axios';


// 1. Define AJV constraints for game launch request
const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: ['string', 'number'] }, // casinoGame.id,
    userId: { type: 'string' },

    ipAddress: { type: 'string' },

    coinType: { type: 'string' },

    isDemo: { type: ['boolean', 'string'] },

    providerCasinoGameId: { type: ['string', 'number'] }, // casinoGame.casinoGameId,
    lang: { type: 'string' },
    isMobile: { type: 'boolean' },
    returnUrl: { type: 'string' },
    depositUrl: { type: 'string' },
  }
})

/**
 * This service is used to accept game launch in real mode for 1GameHub
 * @export
 * @class OneGameHubGameLaunchHandler
 * @extends {BaseHandler}
 */
export class OneGameHubGameLaunchHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      gameId,
      isMobile,
      userId,
      isDemo,
      coin,
      providerCasinoGameId,
      lang,
      ipAddress,
      returnUrl,
      depositUrl
    } = this.args;

    // Determine action type
    const actionType = isDemo === 'true'
      ? ONE_GAME_HUB_REQUEST_ACTIONS.DEMO_PLAY
      : ONE_GAME_HUB_REQUEST_ACTIONS.REAL_PLAY;

    // Generate session ID
    const sessionId = `${ONE_GAME_HUB_SESSION_PREFIX}${userId}_${dayjs().valueOf()}`;

    // Cache session data for 30 minutes
    await setCache(sessionId, JSON.stringify({ userId, coin, gameId, providerCasinoGameId }), 18000);

    // Construct base URL
    const baseUrl = config.get('gameHub1.baseUrl');
    const secretToken = config.get('gameHub1.secretToken');
    const defaultIp = ipAddress || '127.0.0.1';
    const currency = coin === 'SC' ? 'SSC' : 'GOC';

    // Construct game request URL
    const url = isDemo === 'true'
      ? `${baseUrl}?action=${actionType}&secret=${secretToken}&game_id=${providerCasinoGameId}&currency=USD&ip_address=${defaultIp}`
      : `${baseUrl}?action=${actionType}&secret=${secretToken}&player_id=${sessionId}&game_id=${providerCasinoGameId}&currency=${currency}&ip_address=${defaultIp}`;
    console.log(" url  ", url)
    try {
      const response = await axios.get(url);
      console.log(" response  ", response)

      if (!response || !response.data?.response?.game_url) {
        throw new AppError(Errors.INTERNAL_SERVER_ERROR);
      }

      return response.data.response.game_url;
    } catch (error) {
      console.error('Error fetching game URL:', error);
      throw new AppError(Errors.INTERNAL_SERVER_ERROR);
    }
  }

}
