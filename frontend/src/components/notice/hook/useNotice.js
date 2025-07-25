'use client';

import { getNotificationsData } from '@/services/getRequests';
import { useEffect, useState } from 'react';

const useNotice = () => {
  
  const [error, setError] = useState(null);
  const [getLoading,setGetLoading] =useState(false);
  const [noticeData, setnoticeData] = useState();

  const getNotification = async () => {
    setGetLoading(true);
    setError(null);
    try {
      const response = await getNotificationsData();
      setnoticeData(response?.data?.notifications?.rows[0]);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setGetLoading(false);
    }
  };
  useEffect(() => {
    getNotification();
  }, []);

  return {
    getLoading,
    error,
    noticeData,
  };
};

export default useNotice;
