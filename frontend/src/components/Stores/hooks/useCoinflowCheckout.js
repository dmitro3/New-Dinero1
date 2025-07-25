import { useState } from 'react';

const COIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEFAULT_MERCHANT_ID = process.env.NEXT_PUBLIC_DEFAULT_MERCHANT_ID;

export function useCoinflowCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Checkout function to call the Coinflow checkout API
   * @param {object} payload - the body payload object (must include `walletAddress`)
   * @param {string|object} [merchantId=DEFAULT_MERCHANT_ID] - optional custom merchantId or object with id property
   */
  async function checkout(payload, merchantId = DEFAULT_MERCHANT_ID) {
    // Normalize merchantId to string
    let idToUse = merchantId;
    if (typeof merchantId !== 'string') {
      idToUse = merchantId?.id || DEFAULT_MERCHANT_ID;
    }
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${COIN_BASE_URL}/${idToUse}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-coinflow-auth-wallet': payload?.walletAddress || '',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to checkout');
      }

      const responseData = await response.json();

      setData(responseData);
      setLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  return { checkout, loading, error, data };
}
