import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { getCache } from '@src/libs/redis'
import { verifySignature } from '@src/services/helper/casino'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'

export class GetSessionAleaCasinoHandler extends BaseHandler {
  async run() {
    const { casinoSessionId, signature } = this.args

    try {
      // checking signature
      if (!verifySignature(this.args)) {
        return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      }

      const payload = await getCache(casinoSessionId)

      if (!payload) return ALEA_ERROR_TYPES.GAME_SESSION_EXPIRE

      const { userId, coin, gameId } = JSON.parse(payload)

      const player = await db.User.findOne({ where: { userId }, attributes: ['userId'] })
      if (!player) return ALEA_ERROR_TYPES.PLAYER_NOT_FOUND
      return {
        country: 'US',
        currency: coin === 'GC' ? 'GC' : 'SC',
        casinoPlayerId: coin === 'GC' ? `${userId}_GC` : `${userId}_SC`
      }
    } catch (error) {
      console.log('Error in Alea Balance call service', error)
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
