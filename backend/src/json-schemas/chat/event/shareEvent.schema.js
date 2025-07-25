export const shareEventSchema = {
    body: {
        type: 'object',
        properties: {
            chatGroupId: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            imageUrl: { type: 'string' },
            redirectUrl: { type: 'string' },
            amount: { type: 'number' },
            currencyId: { type: 'string' },
            eventType: { type: 'string' }
        },
        required: ['chatGroupId', 'title']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        isEvenetShared: { type: 'boolean' },
                        message: { type: 'string' }
                    }
                },
                errors: { type: 'array' }
            }
        }
    }
}