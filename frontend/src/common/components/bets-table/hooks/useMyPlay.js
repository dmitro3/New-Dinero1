'use client';
import { getAllCasinoTransaction } from '@/services/getRequests';
import { getAccessToken } from '@/services/storageUtils';
import { useEffect, useState } from 'react';

const useMyPlay = () => {
  const [playData, setPlayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const token = getAccessToken();

  const fetchMyPlay = async () => {
    const payload = { limit: limit };
    try {
      const response = await getAllCasinoTransaction(payload);
      setPlayData(response?.data?.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token)
    fetchMyPlay();
  }, [limit,token]);

  return {
    playData,
    loading,
    error,
    limit,
    setLimit,
  };
};

export default useMyPlay;
