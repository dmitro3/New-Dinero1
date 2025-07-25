export const cancelBonusSchema = {
  body: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      userBonusId: { type: 'string' }
    },
    required: ['userId', 'userBonusId']
  }
}
