export const getUserDetailsSchema = {
  query: {
    type: 'object',
    properties: { currencyCode: { type: 'string' } },
    // required: ['userId']
  }
}
