export const sendTipSchema = {
    body: {
        type: 'object',
        properties: {
            tipUsername: { type: 'string' },
            tipAmount: { type: 'number' },
            currencyCode: { type: 'string' },
            isPublic: { type: 'boolean' }
        },
        required: ['tipUsername', 'tipAmount', 'currencyCode'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        tip: {
                            type: 'object',
                            properties: {
                                recipientId: { type: 'number' },
                                amount: { type: 'number' },
                                currencyId: { type: 'string' },
                                createdAt: { type: 'string' },
                            }
                        },
                        message: { type: 'string' }
                    }
                },
                errors: { type: 'array' }
            }
        }
    }
}
