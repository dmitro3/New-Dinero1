export const getOtpSchema = {
  query: {
    type: 'object',
    properties: {
      userEmail: { type: 'string' },
    },
    required: ['userEmail']
  }
}
