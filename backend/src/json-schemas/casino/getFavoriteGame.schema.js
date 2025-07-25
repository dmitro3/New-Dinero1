export const getFavoriteGameSchema = {
  qeury: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      search: { type: ['string', 'null'] }
    },
    required: ['userId']
  }
}
