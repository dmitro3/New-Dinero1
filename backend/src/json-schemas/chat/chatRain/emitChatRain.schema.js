export const emitChatRainSchema = {
    body: {
        type: 'object',
        properties: {
            message: { type: 'string' },
            currencyCode: { type: 'string' },
            rainAmount: { type: 'number' },
            playerCount: { type: 'number' }
        },
        required: ['message', 'currencyCode', 'rainAmount', 'playerCount']
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
                errors: { type: 'array' }
            }
        }
    }
}
