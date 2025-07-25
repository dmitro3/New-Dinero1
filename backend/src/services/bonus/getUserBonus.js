import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetUserBonusHandler extends BaseHandler {
  async run() {
    const { limit, pageNo, userId } = this.args
    const query = { userId }
    let bonusQuery


    const { page, size } = pageValidation(pageNo, limit)
    if (this.args.status) query.bonusStatus = this.args.status
    if (this.args.bonusType) bonusQuery = { bonusType: this.args.bonusType }

    const userBonus = await db.UserBonus.findAndCountAll({
      where: { ...query },
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['updatedAt'] },
      limit: size,
      offset: ((page - 1) * size),
      include: {
        model: db.Bonus,
        as: 'bonus',
        where: bonusQuery,
        attributes: ['id', 'bonusType', 'promotionTitle']
      }
    })

    if (!userBonus) throw new AppError(Errors.BONUS_NOT_FOUND)

    return { userBonus, messages: SUCCESS_MSG.GET_SUCCESS }

  }
}
