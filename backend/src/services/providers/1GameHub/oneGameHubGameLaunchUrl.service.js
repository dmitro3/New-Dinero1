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

    // Construct base URL and secret token
    const baseUrl = config.get('gameHub1.baseUrl');
    const secretToken = config.get('gameHub1.secretToken');
    const defaultIp = ipAddress || '127.0.0.1';
    const currency = coin === 'SC' ? 'SSC' : 'GOC';

    // Validate configuration
    if (!baseUrl) {
      console.error('1GameHub Configuration Error: baseUrl is missing');
      throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub base URL not configured. Please check GAMEHUB1_BASE_URL in your .env file');
    }
    if (!secretToken) {
      console.error('1GameHub Configuration Error: secretToken is missing');
      throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub secret token not configured. Please check GAMEHUB1_SECRET_TOKEN in your .env file');
    }
    
    // Log configuration for debugging
    console.log('1GameHub Configuration:', {
      baseUrl: baseUrl,
      secretTokenConfigured: !!secretToken,
      currency: currency,
      isDemo: isDemo,
      actionType: actionType
    });

    // Construct game request URL based on 1GameHub API structure
    let url;
    if (isDemo === 'true') {
      // Demo play: https://site-ire1.1gamehub.com/integrations/dinerosweeps/rpc?action=demo_play&game_id={game_id}&secret={secret_token}
      url = `${baseUrl}?action=${actionType}&game_id=${providerCasinoGameId}&secret=${secretToken}`;
    } else {
      // Real play: https://site-ire1.1gamehub.com/integrations/dinerosweeps/rpc?action=real_play&game_id={game_id}&currency={currency}&player_id={player_id}&secret={secret_token}
      url = `${baseUrl}?action=${actionType}&game_id=${providerCasinoGameId}&currency=${currency}&player_id=${sessionId}&secret=${secretToken}`;
    }

    console.log("1GameHub URL:", url);
    
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'DineroSweeps/1.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("1GameHub Response Status:", response.status);
      console.log("1GameHub Response Data:", JSON.stringify(response.data, null, 2));

      // Check for error response first
      if (response.data && response.data.code && response.data.code !== 'SUCCESS') {
        console.error('1GameHub API Error:', response.data);
        console.error('1GameHub Request URL:', url);
        console.error('1GameHub Request Params:', { actionType, providerCasinoGameId, currency, sessionId, isDemo });
        
        // Handle specific error codes
        if (response.data.code === 'ERR001') {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub connection error - please check your configuration and network connectivity');
        } else if (response.data.code === 'ERR002') {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub authentication error - please check your secret token');
        } else if (response.data.code === 'ERR003') {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub game not found - please check the game ID');
        } else {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, `1GameHub API error: ${response.data.message || 'Unknown error'}`);
        }
      }

      // Handle different response structures
      let gameUrl = null;
      if (response.data?.response?.game_url) {
        gameUrl = response.data.response.game_url;
      } else if (response.data?.game_url) {
        gameUrl = response.data.game_url;
      } else if (response.data?.url) {
        gameUrl = response.data.url;
      } else if (typeof response.data === 'string' && response.data.startsWith('http')) {
        gameUrl = response.data;
      } else {
        console.error('Invalid response structure from 1GameHub:', response.data);
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, 'Invalid response structure from 1GameHub');
      }

      return gameUrl;
    } catch (error) {
      console.error('Error fetching game URL from 1GameHub:', error.message);
      if (error.response) {
        console.error('1GameHub Error Response Status:', error.response.status);
        console.error('1GameHub Error Response Data:', JSON.stringify(error.response.data, null, 2));
        
        // Handle specific error codes
        if (error.response.data?.code === 'ERR001') {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub connection error - please check your configuration and network connectivity');
        } else if (error.response.data?.code === 'ERR002') {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub authentication error - please check your secret token');
        } else if (error.response.data?.code === 'ERR003') {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub game not found - please check the game ID');
        } else {
          throw new AppError(Errors.INTERNAL_SERVER_ERROR, `1GameHub API error: ${error.response.data?.message || error.message}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, '1GameHub API timeout - please try again');
      } else {
        throw new AppError(Errors.INTERNAL_SERVER_ERROR, `1GameHub API error: ${error.message}`);
      }
    }
  }
}
