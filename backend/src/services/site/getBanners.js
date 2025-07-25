import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { pageValidation } from '@src/utils/common'

export class GetBannersHandler extends BaseHandler {
  async run() {
    const { limit, pageNo, key } = this.args

    const { page, size } = pageValidation(pageNo, limit)
    const banners = await db.Banner.findAndCountAll({
      where: { bannerType: key },
      attributes: ['title', 'description', 'imageUrl', 'mobileImageUrl', 'redirectUrl', 'bannerType', 'isActive'],
      limit: size,
      offset: ((page - 1) * size),
      order: [['createdAt', 'DESC']]
    })

    return { banners }

  }
}
