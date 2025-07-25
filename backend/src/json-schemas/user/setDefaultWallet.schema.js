export const setDefaultWalletSchema = {
  body: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      walletId: { type: 'number' }
    }
  }
}
