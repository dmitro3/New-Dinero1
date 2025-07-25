'use client';
import { getAllWithdarwTransaction } from '@/services/getRequests';
import { useEffect, useState } from 'react';

const useRedeem = () => {
  const [redeemData, setRedeemData] = useState([]);
  const [redeemLoading, setRedeemloading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const payload = { limit: limit, pageNo: pageNo };
  const getReedemTransaction = async () => {
    setRedeemloading(true);
    try {
      const response = await getAllWithdarwTransaction(payload);
      setRedeemData(response?.data?.data?.withdrawRequests);
    } catch (error) {
      console.log(error.message);
    } finally {
      setRedeemloading(false);
    }
  };

  useEffect(() => {
    getReedemTransaction();
  }, [pageNo, limit]);
   
  return {
    redeemData,
    redeemLoading,
    setLimit,
    setPageNo,
    limit
  };
};

export default useRedeem;
