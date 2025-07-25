export const getGroupChatSchema = {
    query: {
        type: 'object',
        properties: {
            search: { type: 'string', transform: ['trim'] },
            pageNo: { type: ['string', 'null'] },
            limit: { type: ['string', 'null'] },
            chatGroupId: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string'},
        },
        required: ['chatGroupId']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        chatDetails: {
                            type: 'array',
                            //items:{}
                        },
                        page: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                },
                errors: { type: 'array' }
            }
        }
    }
}