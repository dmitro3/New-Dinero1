import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'

export class GetNotificationsHandler extends BaseHandler {
  async run () {
    // const { limit, pageNo, search } = this.args
    const { search } = this.args

    // const { page, size } = pageValidation(pageNo, limit)
    const query = { isActive: true }
    if (search) {
      query['title.EN'] = search
    }

    const notifications = await db.Notification.findAndCountAll({
      where: { ...query },
      limit: 1,
      // offset: ((page - 1) * size),
      order: [['createdAt', 'DESC']]
    })

    return { notifications }
  }
}
