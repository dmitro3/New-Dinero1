export const createWithdrawRequestSchema = {
  body: {
    type: 'object',
    properties: {
      userId: { type: ['number'] },
      amount: { type: ['number'] }
    },
    required: ['amount']
  }
}
