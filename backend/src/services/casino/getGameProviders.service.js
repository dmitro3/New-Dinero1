import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'

export class GetGameProvidersHandler extends BaseHandler {

  async run() {


    const casinoProvider = await db.CasinoGame.findAndCountAll({
      where: { isActive: true },
      attributes: [],
      include: {
        model: db.CasinoProvider,
        as: 'CasinoProvider',
        attributes: ['id', 'name', 'thumbnailUrl', 'mobileThumbnailUrl'],
        where: { isActive: true },
        required: false
      },
      raw: true,
      group: [db.sequelize.col('CasinoProvider.id'), db.sequelize.col('CasinoProvider.name'), db.sequelize.col('CasinoProvider.thumbnail_url'), db.sequelize.col('CasinoProvider.mobile_thumbnail_url')]
    })

    if (!casinoProvider) throw new AppError(Errors.CATEGORY_GAME_NOT_FOUND)

    return casinoProvider

  }
}
