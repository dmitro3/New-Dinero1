export const NOWPAYMENT_WEBHOOK_STATUS = {
  WAITING: 'waiting',
  CONFIRMING: 'confirming',
  CONFIRMED: 'confirmed',
  SENDING: 'sending',
  PARTIALLY_PAID: 'partially_paid',
  FINISHED: 'finished',
  FAILED: 'failed',
  EXPIRED: 'expired'
};

// export const NOWPAYMENT_WEBHOOK_MAPPING = {
//   'waiting': 0,
//   'confirming': 0,
//   'confirmed': 1,
//   'sending': 0,
//   'partially_paid': 1,
//   'finished': 1,
//   'failed': 3,
//   'expired': 7
// };

export const NOWPAYMENT_WEBHOOK_MAPPING = {
  'waiting': 'pending',
  'confirming': 'pending',
  'confirmed': 'successful',
  'sending': 'pending',
  'partially_paid': 'successful',
  'finished': 'successful',
  'failed': 'failed',
  'expired': 'pending'
};



export const NOWPAYMENT_WEBHOOK_REDEEM_STATUS = {
  WAITING: 'WAITING',
  CONFIRMING: 'CONFIRMING',
  CONFIRMED: 'CONFIRMED',
  SENDING: 'SENDING',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  FINISHED: 'FINISHED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
  PROCESSING: 'PROCESSING',
  REJECTED: 'REJECTED',
  CREATING: 'CREATING'
};


export const COIN_FLOW_WEBHOOK_STATUS = {
  CARD_PAYMENT_AUTHORIZED: 'Card Payment Authorized',
  CARD_PAYMENT_DECLINED: 'Card Payment Declined',
  SETTLED: 'Settled',
  ACH_INITIATED: 'ACH Initiated',
  ACH_BATCHED: 'ACH Batched',
  ACH_RETURNED: 'ACH Returned',
  ACH_FAILED: 'ACH Failed',
  USDC_PAYMENT_RECEIVED: 'USDC Payment Received',
  CARD_PAYMENT_CHARGEBACK_OPENED: 'Card Payment Chargeback Opened',
  CARD_PAYMENT_CHARGEBACK_WON: 'Card Payment Chargeback Won',
  CARD_PAYMENT_CHARGEBACK_LOST: 'Card Payment Chargeback Lost',
  CARD_PAYMENT_SUSPECTED_FRAUD: 'Card Payment Suspected Fraud',
  PAYMENT_PENDING_REVIEW: 'Payment Pending Review'
}


export const COIN_FLOW_WEBHOOK_MAPPING = {
  'Card Payment Authorized': 'pending',
  'Card Payment Declined': 'failed',
  'Settled': 'successful',
  'ACH Initiated': 'pending',
  'ACH Batched': 'pending',
  'ACH Returned': 'failed',
  'ACH Failed': 'failed',
  'USDC Payment Received': 'pending',
  'Card Payment Chargeback Opened': 'pending',
  'Card Payment Chargeback Won': 'pending',
  'Card Payment Chargeback Lost': 'failed',
  'Card Payment Suspected Fraud': 'failed',
  'Payment Pending Review': 'pending',
};
