export const getAllGamesSchema = {
  query: {
    type: 'object',
    properties: {
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      category: { type: ['string', 'null'] },
      rating: {
        type: ['string', 'null']
      },
      provider: { type: ['string', 'null'] },
      search: { type: ['string', 'null'] },
      isFeatured: { type: ['string', 'null'] },
      userId: { type: ['number', 'null'] },
      deviceType: { type: 'string' },
      ipAddress: {
        type: 'string'
      }
    }
  }
}
