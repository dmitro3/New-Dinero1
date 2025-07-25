import { ACTION_TYPE } from '@src/utils/constants/casino.constants'

export const getCasinoTransactionsSchema = {
  query: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      startDate: { type: ['string', 'null'] },
      currencyCode: { type: ['string', 'null'] },
      endDate: { type: ['string', 'null'] },
      actionType: { enum: Object.values(ACTION_TYPE) }
    },
    required: ['userId']
  }
}
