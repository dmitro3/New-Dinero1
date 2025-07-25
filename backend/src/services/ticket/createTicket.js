import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { TICKET_STATUSES } from "@src/utils/constants/public.constants";
import { SUCCESS_MSG } from "@src/utils/success";

export class CreateTicketHandler extends BaseHandler {
  async run() {
    const { userId, subject, body } = this.args
    const transaction = this.dbTransaction;

    const runningTickets = await db.Ticket.findAndCountAll({
      where: { status: [TICKET_STATUSES.OPEN, TICKET_STATUSES.ACTIVE], userId },
      transaction
    })

    if (runningTickets.count == 5)
      throw new AppError(Errors.MAXIMUM_5_OPEN_OR_ACTIVE_TICKETS_ALLOWED)

    const ticket = await db.Ticket.create(
      { userId, subject, body }, transaction)

    return { ticket, message: SUCCESS_MSG.CREATE_SUCCESS }
  }
}
