export const getTicketMessagesSchema = {
  query: {
    type: 'object',
    properties: {
      ticketId: { type: ['number','string'] },
    },
    required: ['ticketId']
  }
}
