export const currencyConversionSchema = {
    body: {
        type: 'object',
        properties: {
            amount: { type: ['number'] },
            convertFrom: { type: ['string'] },
            convertTo: { type: ['string'] },
        },
        required: ['amount', 'convertFrom', 'convertTo']
    }
}