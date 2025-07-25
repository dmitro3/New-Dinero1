import db from "@src/db/models";
import { BaseHandler } from "@src/libs/logicBase";
import { pageValidation } from "@src/utils/common";
import { SUCCESS_MSG } from "@src/utils/success";


export class GetTicketHandler extends BaseHandler {
  async run() {
    const { userId, limit, pageNo } = this.args

    const { page, size } = pageValidation(pageNo, limit)
    const offset = (page - 1) * size

    const tickets = await db.Ticket.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: size,
      offset
    })

    return { tickets, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
