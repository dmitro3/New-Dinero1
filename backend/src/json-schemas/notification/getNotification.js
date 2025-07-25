export const getNotificationSchema = {
  query: {
    type: 'object',
    properties: {
      limit: { type: 'string', minimum: 1 },
      pageNo: { type: 'string', minimum: 1 },
      search: { type: ['string', 'null'] }

    },
    required: []
  }
}
