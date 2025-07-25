import config from '@src/configs/app.config'
import { aleaCasinoConfig } from '@src/configs/casinoproviders/alea.config'
import ajv from '@src/libs/ajv'
import { BaseHandler } from '@src/libs/logicBase'
import { setCache } from '@src/libs/redis'
import { ALEA_SESSION_PREFIX } from '@src/utils/constants/casinoProviders/alea.constants'
import { COINS } from '@src/utils/constants/public.constants'
import dayjs from 'dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: ['string', 'number'] },
    providerCasinoGameId: { type: ['string', 'number'] },
    userId: { type: 'string' },
    lang: { type: 'string' },
    coinType: { type: 'string' },
    isMobile: { type: 'boolean' },
    ipAddress: { type: 'string' }
  }
})

/**
This service is used to accept game launch in real mode
@export
@class GameLaunchHandler
@extends {BaseHandler}
*/
export class AleaGameLaunchHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    const { gameId, isMobile, userId, isDemo, coin, providerCasinoGameId } = this.args
    const environment_id = (coin !== COINS.GOLD_COIN) ? aleaCasinoConfig.ppEnvironmentId : aleaCasinoConfig.environmentId
    const sessionId = `${ALEA_SESSION_PREFIX}${userId}_${dayjs().valueOf()}`
    await setCache(sessionId, JSON.stringify({ userId, coin, gameId, providerCasinoGameId }), 1800)
    const gameUrl = `https://play.aleaplay.com/api/v1/games/${providerCasinoGameId}?casinoSessionId=${sessionId}&environmentId=${environment_id}&locale=en&device=${isMobile ? 'MOBILE' : 'DESKTOP'}&gameMode=${isDemo === 'true' ? 'DEMO' : 'REAL'}&lobbyUrl=${encodeURIComponent(config.get('app.userFrontendUrl'))}`;
    return gameUrl
  }
}
