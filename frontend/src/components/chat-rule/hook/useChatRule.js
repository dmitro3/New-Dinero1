'use client';

import { getChatRule } from '@/services/getRequests';
import { useEffect, useState } from 'react';

const useChatRule = () => {
  const [error, setError] = useState(null);
  const [getLoading, setGetLoading] = useState(false);
  const [chatRuleData, setchatRuleData] = useState();

  const fetchChatRule = async () => {
    setGetLoading(true);
    setError(null);
    try {
      const response = await getChatRule();
      setchatRuleData(response?.data?.chatRules[0]);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setGetLoading(false);
    }
  };
  useEffect(() => {
    fetchChatRule();
  }, []);

  return {
    getLoading,
    error,
    chatRuleData,
  };
};

export default useChatRule;
