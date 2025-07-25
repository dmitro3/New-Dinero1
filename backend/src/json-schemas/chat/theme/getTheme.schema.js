export const getThemeSchema = {
    query: {
        type: 'object'
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object'
                },
                errors: { type: 'array' }
            }
        }
    }
}