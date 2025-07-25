export const createTicketMessageSchema = {
  body: {
    type: 'object',
    properties: {
      ticketId: { type: ['number','string'] },
      message: { type: 'string' },
    },
    required: ['ticketId', 'message']
  }
}
