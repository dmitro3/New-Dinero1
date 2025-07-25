export const verifyOtpSchema = {
  body: {
    type: 'object',
    properties: {
      otp: { type: ['string','number'] },
    },
    required: ['otp']
  }
}
