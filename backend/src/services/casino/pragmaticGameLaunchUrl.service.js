import config from '@src/configs/app.config'
import db from '@src/db/models'
import { AppError } from "@src/errors/app.error"
import { Errors } from "@src/errors/errorCodes"
import Logger from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import { calculateHash } from '@src/utils/common'
import axios from 'axios'
import qs from 'qs'

export class PragmaticGameUrlHandler extends BaseHandler {
  async run() {
    const { playerId, gameId, playMode, platform } = this.args

    const requestData = {
      symbol: gameId,
      lobbyUrl: config.get('app.userFrontendUrl'),
      cashierUrl: config.get('app.userFrontendUrl'),
      platform: platform,
      language: 'en',
      playMode: playMode,
      secureLogin: config.get('pragmaticPlay.secureLogin')
    }
    if (playerId) {
      const user = await db.User.findOne({
        where: { userId: playerId },
        attributes: ['uniqueId', 'userId', 'locale']
      })
      if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
      requestData.language = user.locale || 'en'
      requestData.token = user.uniqueId
      requestData.externalPlayerId = user.userId
    }

    const hash = calculateHash(requestData, config.get('pragmaticPlay.secretKey'))
    requestData.hash = hash

    const response = await axios({
      url: `${config.get('pragmaticPlay.baseUrl')}/CasinoGameAPI/game/url/`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(requestData)
    })

    return response.data
  } catch(error) {
    Logger.error('Internal Server error', { exception: error })
    this.addError('InternalServerErrorType')
  }
}

