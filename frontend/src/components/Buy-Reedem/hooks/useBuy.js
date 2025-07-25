'use client';
import { getAllPackage } from '@/services/getRequests';
import { useStateContext } from '@/store';
import { useRouter } from 'next/navigation';
// import { DepositPayment } from '@/services/postRequest';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useBuy = () => {
  const { t } = useTranslation();

  const [buyPacakageData, setBuyPacakageData] = useState([]);
  const [buyPacakageError, setBuyPacakageError] = useState(null);
  const [buyPacakageLoading, setBuyPacakageLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isKycVerified, setIsKycVerified] = useState(false);

  const {
    state: { user },
  } = useStateContext();

  useEffect(() => {
    if (user?.userDetails?.coinflowKycStatus === 'SUCCESS') {
      setIsKycVerified(true);
    }
  }, [user?.userDetails?.coinflowKycStatus]);

  const router = useRouter();

  // const [depositPaymentData, setDepositPaymentData] = useState([]);
  // const [depositPaymentError, setDepositPaymentError] = useState(null);
  // const [depositPaymentLoading, setDepositPaymentLoading] = useState(false);

  const payload = { limit: limit, pageNo: pageNo };

  const getBuyPackage = async () => {
    setBuyPacakageLoading(true);
    setBuyPacakageError(null);
    try {
      const response = await getAllPackage(payload);
      setBuyPacakageData(response?.data?.packages?.rows);
      // console.log(response?.data);
    } catch (err) {
      setBuyPacakageError(err.message);
    } finally {
      setBuyPacakageLoading(false);
    }
  };

  // const getDepositPayments = async () => {
  //   setDepositPaymentLoading(true);
  //   setDepositPaymentError(null);
  //   try {
  //     const response = await DepositPayment(payload);
  //     setDepositPaymentData(response?.data?.payments?.rows);
  //   } catch (err) {
  //     setDepositPaymentError(err.message);
  //   } finally {
  //     setDepositPaymentLoading(false);
  //   }
  // };

  useEffect(() => {
    getBuyPackage();
    // getDepositPayments();
  }, [pageNo, limit]);

  return {
    buyPacakageData,
    buyPacakageError,
    buyPacakageLoading,
    // depositPaymentData,
    // depositPaymentError,
    // depositPaymentLoading,
    setPageNo,
    setLimit,
    t,
    isKycVerified,
    router,
  };
};

export default useBuy;
