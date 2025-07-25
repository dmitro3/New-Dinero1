export const updateUserDocumentSchema = {
  body: {
    type: 'object',
    properties: {
      user: { type: 'object' },
      documentLabelId: { type: 'string' },
      document: { type: 'object' },
      level: { type: 'string', enum: ['2', '3', '4'] }

    },
    required: ['document', 'user', 'documentLabelId', 'level']
  }
}
