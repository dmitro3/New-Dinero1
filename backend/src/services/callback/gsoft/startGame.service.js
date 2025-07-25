import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import { BaseHandler } from '@src/libs/logicBase'
import db from '@src/db/models'
import config from '@src/configs/app.config'
import { v4 as uuid } from 'uuid'

export default class StartGameHandler extends BaseHandler {
  async run() {
    const gameId = this.args.gameId
    const userId = this.args.userId
    const gameMode = this.args.gameMode
    const deviceType = this.args.deviceType || 'Desktop'


    const casinoGame = await db.CasinoGame.findOne({
      where: { id: gameId, isActive: true },
      attributes: ['casinoGameId'],
      include: [{
        model: db.CasinoCategory,
        where: { isActive: true },
        attributes: [],
        required: true
      }, {
        model: db.CasinoProvider,
        where: { isActive: true },
        attributes: [],
        required: true
      }]
    })

    if (!casinoGame) throw new AppError(Errors.GAME_NOT_FOUND)

    const sessionId = config.get('gsoft.operatorId') + '_' + uuid()
    let gameLauchUrl = `${config.get('gsoft.startGameUrl')}/game?nogsgameid=${casinoGame?.casinoGameId}&nogsoperatorid=${config.get('gsoft.operatorId')}&sessionid=${sessionId}&nogscurrency=USD&nogslang=EN&nogsmode=${gameMode}&accountid=${userId}&homeurl=${config.get('app.userFrontendUrl')}&device_type=${deviceType}&country=US&is_test_account=False&license=${config.get('gsoft.licence')}`

    return { gameLauchUrl }
  }
}

