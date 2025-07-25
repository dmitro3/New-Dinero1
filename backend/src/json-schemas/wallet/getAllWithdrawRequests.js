export const getAllWithdrawRequestSchema = {
  query: {
    type: 'object',
    properties: {
      limit: { type: 'string', default: '10' },
      userId: { type: 'string' },
      pageNo: { type: 'string', default: '1' },
      search: { type: ['string', 'null'] },
      endDate: { type: ['string', 'null'] },
      startDate: { type: ['string', 'null'] },
      status: { type: ['string'], enum: ['Pending', 'Success', 'Cancelled', 'null', ''] }
    }
  }
}
