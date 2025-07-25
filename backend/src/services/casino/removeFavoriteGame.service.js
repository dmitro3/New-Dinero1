import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'

export class RemoveFavoriteGameHandler extends BaseHandler {
  async run () {
    const { casinoGameId, userId } = this.args

  
      const checkFavoriteGameExists = await db.CasinoFavoriteGame.findOne({
        where: { casinoGameId, userId },
        attributes: ['id']
      })
      if (!checkFavoriteGameExists) throw new AppError(Errors.FAVORITE_GAME_NOT_FOUND)

      await db.CasinoFavoriteGame.destroy({ where: { casinoGameId, userId } })
      return { success: true }
   
  }
}
