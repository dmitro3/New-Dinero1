export const addFavoriteGameSchema = {
  body: {
    type: 'object',
    properties: {
      casinoGameId: { type: 'number' },
      userId: { type: 'number' }
    },
    required: ['casinoGameId', 'userId']
  }
}
