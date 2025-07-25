'use client';

import {
  getAllCasinoTransaction,
  getAllTransaction,
} from '@/services/getRequests';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { options } from '../constants';

const useTransactionColList = () => {
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState([]);
  const [casinoData, setCasinoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [casinoPageNo, setCasinoPageNo] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('active');
  const [activeTab, setActiveTab] = useState(currentTab || options[0].value);
  const onClose = () => {
    router.push('/');
  };
  const getTransactionData = useCallback(
    async ({ purpose = 'purchase' }) => {
      const payload = {
        limit: limit,
        pageNo: pageNo,
        purpose: purpose,
        startDate: '2024-01-01',
      };
      setLoading(true);
      try {
        const response = await getAllTransaction(payload);
        setData(response?.data?.data || []);
        setTotalCount(response?.data?.totalCount);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [limit, pageNo]
  );

  const getCasinoTransactionData = useCallback(async () => {
    const payload = {
      limit: limit,
      pageNo: casinoPageNo,
      startDate: '2024-01-01',
    };
    setLoading(true);
    try {
      const response = await getAllCasinoTransaction(payload);
      setCasinoData(response?.data?.data || []);
      setTotalCount(response?.data?.totalCount);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, [casinoPageNo, limit]);
  useEffect(() => {
    getTransactionData({ purpose: 'purchase' });
  }, [limit, pageNo]);
  useEffect(() => {
    getCasinoTransactionData();
  }, [limit, casinoPageNo]);

  // const buyData = [
  //   {
  //     transactionDate: '26/11/2024',
  //     transactionAmount: 2000,
  //     beforeBalance: 223333,
  //     transactionType: 'deposit',
  //   },
  //   {
  //     transactionDate: '27/11/2024',
  //     transactionAmount: 2000,
  //     beforeBalance: 223333,
  //     transactionType: 'deposit',
  //   },
  // ];
  // useEffect(() => {
  //   getCasinoTransactionData();
  //   getTransactionData('purchase');
  // }, [getCasinoTransactionData]);

  return {
    loading,
    data,
    casinoData,
    limit,
    getTransactionData,
    getCasinoTransactionData,
    setPageNo,
    setLimit,
    pageNo,
    totalCount,
    casinoPageNo,
    setCasinoPageNo,
    activeTab,
    setActiveTab,
    onClose,
  };
};
export default useTransactionColList;
