import { useState } from 'react';
import { cardPayment } from '@/services/postRequest';

const useCardPayment = (onSuccess, onError) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const payWithCard = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await cardPayment(formData);

      if (result?.success) {
        setSuccess(true);
        onSuccess?.(result.message || 'Payment successful!');
        return { status: 'success', message: result.message };
      } else {
        throw new Error(result?.message || 'Payment failed!');
      }
    } catch (err) {
      const message = err.message || 'Something went wrong!';
      setError(message);
      onError?.(message);
      return { status: 'error', message };
    } finally {
      setLoading(true);
    }
  };

  return {
    payWithCard,
    loading,
    error,
    success,
  };
};

export default useCardPayment;
