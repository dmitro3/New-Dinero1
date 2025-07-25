import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
// import { SUCCESS_MSG } from '@src/utils/success'

export class GetBonusDetailHandler extends BaseHandler {
  async run() {
    const { bonusId, userId } = this.args
    const include = []

    if (userId) {
      include.push({
        model: db.UserBonus,
        where: { userId, bonusId },
        required: false
      })
    }
    const bonusDetails = await db.Bonus.findOne({
      where: { id: bonusId },
      include: include
    })
    if (!bonusDetails) throw new AppError(Errors.BONUS_NOT_FOUND)

    let eligibleGames = []
    if (bonusDetails.eligibleGames && bonusDetails.eligibleGames.length > 0) {
      eligibleGames = await db.CasinoGame.findAll({
        where: {
          id: {
            [db.Sequelize.Op.in]: bonusDetails.eligibleGames
          }
        },
        attributes: ['id', 'name', 'thumbnailUrl']
      })
    }

    return {
      bonusDetails: {
        ...bonusDetails.toJSON(),
        eligibleGames: eligibleGames.map(game => ({
          id: game.id,
          name: game.name,
          thumbnailUrl: game.thumbnailUrl
        }))
      }
    }
  }
}
