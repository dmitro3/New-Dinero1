export const awailFaucetSchema = {
  body: {
    type: 'object',
    properties: {
      currencyCode: { type: 'string' },
    },
    required: ['currencyCode']
  }
}
