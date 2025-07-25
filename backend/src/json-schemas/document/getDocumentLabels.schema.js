export const getDocumentLabelsSchema = {
  query: {
    type: 'object',
    properties: {
      user: { type: 'object' }
    },
    required: ['user']
  }
}
