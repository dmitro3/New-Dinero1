export const availBonusSchema = {
  body: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      bonusId: { type: 'string' }
    },
    required: ['userId', 'bonusId']
  }
}
