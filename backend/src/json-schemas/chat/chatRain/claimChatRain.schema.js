export const claimChatRainSchema = {
    body: {
        type: 'object',
        properties: {
            chatRainId: { type: 'number' },
        },
        required: ['chatRainId']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        claimData: {},
                        message: { type: 'string' }
                    }
                },
                errors: { type: 'array' }
            }
        }
    }

}