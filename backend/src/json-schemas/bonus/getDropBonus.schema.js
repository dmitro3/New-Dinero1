export const getDropBonusSchema = {
    query: {
        type: 'object',
        properties: {
            limit: { type: 'string' },
            pageNo: { type: 'string' },
            isActive: { type: ['string', 'null'], }
        },
        required: ['limit', 'pageNo']
    }
}