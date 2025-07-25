export const getBonusDetailSchema = {
  query: {
    type: 'object',
    properties: {
      bonusId: { type: 'string' },
      language: { type: 'string' },
      ipAddress: { type: 'string' },
      userId: { type: ['number', 'null'] }
    },
    required: ['bonusId']
  }
}
