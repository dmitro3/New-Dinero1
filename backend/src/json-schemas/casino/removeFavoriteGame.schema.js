export const removeFavoriteGameSchema = {
  body: {
    type: 'object',
    properties: {
      casinoGameId: { type: 'number' },
      userId: { type: 'number' }
    },
    required: ['casinoGameId', 'userId']
  }
}
