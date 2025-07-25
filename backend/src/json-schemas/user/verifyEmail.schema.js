export const verifyEmailSchema = {
  get: {
    type: 'object',
    properties: {
      emailToken: { type: 'string' }
    },
    required: ['emailToken']
  }
}
