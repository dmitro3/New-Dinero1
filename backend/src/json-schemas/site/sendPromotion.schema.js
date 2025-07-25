export const sendPromotionSchema = {
  body: {
    type: 'object',
    properties: {
      image: { type: 'string' },
      content: { type: 'string' }
    },
    required: ['image', 'content']
  }
}
