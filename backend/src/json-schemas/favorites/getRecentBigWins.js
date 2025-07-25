export const getRecentBigWinsSchema = {
  query: {
    type: 'object',
    properties: {
      limit: { type: 'string' },
      pageNo: { type: 'string' },
      endDate: { type: ['string', 'null'] }
    },
    required: []
  }
}
