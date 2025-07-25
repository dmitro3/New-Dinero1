export const getUserTransactionsSchema = {
  query: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      startDate: { type: ['string', 'null'] },
      endDate: { type: ['string', 'null'] },
      purpose: { type: ['string', 'null'] },
      currencyCode: { type: ['string', 'null'] },
      transactionType: { enum: ['bonus', 'deposit', 'withdraw', '', 'null', 'all', 'addMoney', 'removeMoney', 'addMoneyInternal', 'removeMoneyInternal', 'depositInternal', 'withdrawInternal', 'commision', 'bonusReferral'] },
      search: { type: ['string', 'null'] }
    },
    required: ['userId']
  }
}
