export const getPromotionsSchema = {
  query: {
    type: 'object',
    properties: {
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      category: { type: ['string', 'null'] }
    }
  }
}
