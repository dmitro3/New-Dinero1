export const getUserInfoSchema = {
    query: {
        type: 'object',
        properties: {
            newUserId: { type: 'string' },
            currencyCode: { type: 'string' }
        },
        required: ['newUserId', 'currencyCode']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                errors: { type: 'string' }
            }
        }
    }
}