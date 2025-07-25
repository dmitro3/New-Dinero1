export const getIPNPaymentStatusSchema = {
  query: {
    type: 'object',
    properties: {
      price_amount: { type: ['number'] },
      id: { type: ['number'] },
      pay_amount: { type: ['number'] },
      price_currency: { type: ['string'] },
      payment_id: { type: ['number', 'string'] },
      parent_payment_id: { type: ['number', 'string'] },
      order_id: { type: ['number', 'null'] },
      payment_status: { type: ['string'] },
      pay_address: { type: ['string'] },
      purchase_id: { type: ['string'] },
      fee: { type: ['object', 'null'] },
      actually_paid_at_fiat: { type: ['number', 'null'] }
    },
    required: ['payment_status']
  }
}
