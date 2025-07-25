import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetPromotionsHandler extends BaseHandler {
  async run() {
    const { limit, pageNo, category } = this.args

    const { page, size } = pageValidation(pageNo, limit)
    let query

    if (category) query = { category }

    const promotions = await db.Promotions.findAndCountAll({
      where: query || {},
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      limit: size,
      offset: ((page - 1) * size),
      order: [['createdAt', 'DESC']]
    })

    return { promotions, message: SUCCESS_MSG.GET_SUCCESS }

  }
}
