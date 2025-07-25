import { useState } from 'react';
import { getsessionkey } from '@/services/getRequests';

const useCoinFlowSessionKey = () => {
  const [sessionKey, setSessionKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessionKey = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getsessionkey();
      setSessionKey(response?.data?.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  return { sessionKey, loading, error, fetchSessionKey };
};

export default useCoinFlowSessionKey;
