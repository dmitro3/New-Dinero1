
export const claimWelcomeBonusSchema = {
    body: {
        type: 'object',
        properties: {
            userId: { type: 'number' },
        },
        required: ['userId']
    }
}