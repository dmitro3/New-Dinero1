export const claimBonusDropSchema = {
    body: {
        type: 'object',
        properties: {
            code: { type: 'string' },
        },
        required: ['code']
    }
}