export const getReferredUsersSchema={
  query: {
      type: 'object',
      properties: {
        userId: { type: ['number', 'string'] },
        limit: { type: ['string', 'null'] },
        pageNo: { type: ['string', 'null'] },
        sortBy: { type: ['string', 'null'] },
        sortDirection: { type: ['string', 'null'] },
      },
      required: ['userId']
  }
}
