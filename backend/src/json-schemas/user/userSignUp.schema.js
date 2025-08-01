export const userSignUpSchema = {
  body: {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      password: { type: 'string' },
      language: { type: 'string' },
      username: { type: 'string' },
      referralCode: { type: ['string', 'null'] }
    }
  }
}
