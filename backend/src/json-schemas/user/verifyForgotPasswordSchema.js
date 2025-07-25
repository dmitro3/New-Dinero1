export const verifyForgotPasswordSchema = {
    body: {
      type: 'object',
      properties: {
        newPasswordKey: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['newPasswordKey', 'password']
    }
  }
  