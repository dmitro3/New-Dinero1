export const userSignUpSchema = {
  body: {
    type: 'object',
    properties: {
      firstName: { type: 'string', maxLength: 50 },
      lastName: { type: 'string', maxLength: 50 },
      password: { type: 'string', minLength: 6 },
      language: { type: 'string', default: 'EN' },
      username: { type: 'string' },
      // referralCode: { type: 'string' },
      referralCode: { type: ['string', 'null'] }
    },
    required: ['username', 'password']
  }
}
