export const unblockReportedUserSchema = {
    body: {
        type: 'object',
        properties: {
            reportedUserId: { type: 'number' },
            groupId: { type: 'string' }
        },
        required: ['reportedUserId']
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