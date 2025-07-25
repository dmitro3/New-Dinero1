// constants.js
import { bitcoin, gpay, bank, applepayss, credit } from '@/assets/png';

export const paymentMethods = [
  { src: credit, alt: 'Credit Card', label: 'Credit Card', path: 'card' },
  { src: gpay, alt: 'Google Pay', label: 'Google Pay', path: 'gpay' },
  { src: applepayss, alt: 'Apple Pay', label: 'Apple Pay', path: 'apay' },
  { src: bank, alt: 'Bank Transfer', label: 'Bank Transfer', path: 'bank' },
  {
    src: bitcoin,
    alt: 'Crypto Currency',
    label: 'Crypto Currency',
    path: 'crypto',
  },
];

export const cryptoCurrencies = [
  { src: bitcoin, alt: 'Bitcoin', label: 'Bitcoin', value: 'bitcoin' },
  { src: bitcoin, alt: 'USDT', label: 'USDT', value: 'usdt' },
];

export const getCoinflowPayload = (userDetails, selectedPackage, upiId, solanaWalletAddress) => ({
  subtotal: {
    cents: Math.round((selectedPackage?.amount || 0) * 100),
    currency: 'USD',
  },
  webhookInfo: {},
  chargebackProtectionData: [],
  customerInfo: {
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    email: userDetails?.email,
    country: userDetails?.country,
    city: userDetails?.city,
    state: userDetails?.state,
    zip: userDetails?.zip,
    address: userDetails?.address,
    dob: userDetails?.dob,
    ip: userDetails?.ip,
    lat: userDetails?.lat,
    lng: userDetails?.lng,
    verificationId: userDetails?.verificationId,
  },
  settlementType: 'Credits',
  authOnly: true,
  feePercentage: 0,
  fixedFee: { cents: 0 },
  jwtToken: 'string',
  threeDsChallengePreference: 'NoPreference',
  paymentData: {
    apiVersion: 2,
    apiVersionMinor: 0,
    email: userDetails?.email,
    shippingAddress: {
      name: `${userDetails?.firstName} ${userDetails?.lastName}`,
      address1: userDetails?.address,
      locality: userDetails?.city,
      administrativeArea: userDetails?.state,
      countryCode: userDetails?.country,
      postalCode: userDetails?.zip,
      phoneNumber: userDetails?.phone,
    },
    upiId: upiId,
  },
  walletAddress: solanaWalletAddress || '',
});

export const BANK_TRANSFER_STATUS = {
  plaid: 'Connecting to your bank...',
  exchange: 'Verifying bank details...',
  payment: 'Processing payment...',
  complete: 'Payment successful!',
  default: 'Connect your bank',
};