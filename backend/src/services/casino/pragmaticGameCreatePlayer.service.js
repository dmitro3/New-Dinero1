import config from '@src/configs/app.config'
import db from '@src/db/models'
import { AppError } from "@src/errors/app.error"
import { Errors } from "@src/errors/errorCodes"
import Logger from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import { calculateHash } from '@src/utils/common'
import axios from 'axios'
import qs from 'qs'

export class PragmaticCreatePlayerHandler extends BaseHandler {
  async run() {
    const { userId } = this.args


    const user = await db.User.findOne({
      where: { userId },
      attributes: ['uniqueId', 'userId', 'locale', 'currencyCode', 'other']
    })
    if (!user) throw new AppError(Errors.USER_NOT_EXISTS)

    const currency = await db.Currency.findAll({
      where: { type: 1 },
      attributes: ['currencyId', 'code']
    })

    let otherData = user.other
    if (!otherData) otherData = {}
    for (const i of currency) {
      const playerId = `${userId}PP${i.code}`
      const requestData = {
        externalPlayerId: playerId,
        currency: i.code,
        secureLogin: config.get('pragmaticPlay.secureLogin')
      }
      const hash = calculateHash(requestData, config.get('pragmaticPlay.secretKey'))
      requestData.hash = hash
      const response = await axios({
        url: `${config.get('pragmaticPlay.baseUrl')}/CasinoGameAPI/player/account/create/`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(requestData)
      })
      if (response.data) {
        otherData[`${userId}PP${i.code}`] = response.data.playerId
      }
    }
    user.other = otherData
    await user.save()

    return {}
  } catch(error) {
    Logger.error('Internal Server error', { exception: error })
    this.addError('InternalServerErrorType')
  }
}

