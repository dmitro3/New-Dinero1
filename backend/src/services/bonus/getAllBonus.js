
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetAllBonusHandler extends BaseHandler {
  async run() {
    const { limit, pageNo, bonusType } = this.args

    let query = {}

    const { page, size } = pageValidation(pageNo, limit)
    if (bonusType) query = { ...query, bonusType }

    const bonus = await db.Bonus.findAndCountAll({
      where: query,
      order: [['id', 'ASC']],
      limit: size,
      offset: ((page - 1) * size),
      include: {
        model: db.UserBonus,
        attributes: ['id'],
        as: 'userBonus',
        require: false
      }
    })

    return { bonus, messages: SUCCESS_MSG.GET_SUCCESS }
  }
}
