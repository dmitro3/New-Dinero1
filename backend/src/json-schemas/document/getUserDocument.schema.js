export const getUserDocumentSchema = {
  query: {
    type: 'object',
    properties: {
      id: { type: 'number' }
    },
    required: ['id']
  }
}
