export const getFaucetSchema = {
  query: {
    type: 'object',
    properties: {
      currencyCode: { enum: ['GC', 'PSC', 'SC', 'BSC'] },
    },
    required: ['currencyCode']
  }
}
