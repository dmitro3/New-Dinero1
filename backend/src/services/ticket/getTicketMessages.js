import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { SUCCESS_MSG } from "@src/utils/success";

export class GetTicketMessagesHandler extends BaseHandler {
  async run() {
    const { ticketId } = this.args
    const mainTicket = await db.Ticket.findOne({
      where: { id: ticketId },
      include: [
        {
          model: db.TicketMessage,
          as: 'ticketMessage',
        }
      ]
    })

    if (!mainTicket)
      throw new AppError(Errors.INVALID_TICKET_ID)

    return { mainTicket, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
