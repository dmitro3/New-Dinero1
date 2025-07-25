export const postalClaimRequestSchema = {
    body: {
        type: 'object',
        properties: {
            email: { type: 'string' },
            postalCode: { type: 'string' },
        },
        required: ['email', 'postalCode']
    }
}