'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getBets } from '@/services/getRequests';
import { getAccessToken } from '@/services/storageUtils';

const useBetsTable = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('highRollers');
  const [selectedRowLimit, setSetSelectedRowLimit] = useState('11');
  const [betsData, setBetsData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRowLimitChange = (value) => {
    setSetSelectedRowLimit(value);
  };
  const token = getAccessToken();


  const fetchBets = async () => {
    setLoading(true);
    try {
      const response = await getBets();
      setBetsData(response?.data?.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token)
      fetchBets();
  }, [token]);

  return {
    active,
    setActive,
    selectedRowLimit,
    handleRowLimitChange,
    t,
    betsData,
    error,
    loading,
  };
};

export default useBetsTable;
