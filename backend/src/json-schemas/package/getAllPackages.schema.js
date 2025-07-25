export const getAllPackagesSchema = {
  query: {
    type: 'object',
    properties: {
      limit: { type: 'string' },
      pageNo: { type: 'string' }
    },
    required: ['limit', 'pageNo']
  }
}
