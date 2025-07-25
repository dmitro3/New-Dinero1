import db from "@src/db/models";
import { BaseHandler } from "@src/libs/logicBase";
import { SUCCESS_MSG } from "@src/utils/success";

export class CreateTicketMessageHandler extends BaseHandler {
  async run() {
    const { ticketId, userId, message } = this.args

    const transaction = this.dbTransaction
    const ticketMessage = await db.TicketMessage.create(
      {
        ticketId,
        message,
        senderId: userId,
        isAdminResponse: false
      }, transaction)

    return { ticketMessage, message: SUCCESS_MSG.CREATE_SUCCESS }
  }
}
