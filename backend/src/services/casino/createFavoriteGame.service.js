import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'

export class AddFavoriteGameHandler extends BaseHandler {
  async run () {
    const { casinoGameId, userId } = this.args
  
      const casinoGame = await db.CasinoGame.findOne({
        where: { id: casinoGameId }
      })
      if (!casinoGame) throw new AppError(Errors.GAME_NOT_FOUND)

      const casinoFavGame = await db.CasinoFavoriteGame.findOne({
        where: { casinoGameId, userId },
        attributes: ['id']
      })
      if (casinoFavGame) throw new AppError(Errors.FAVORITE_GAME_EXISTS)

      const favoriteGame = await db.CasinoFavoriteGame.create({ userId: userId, casinoGameId })

      return favoriteGame
   
  }
}
