'use client';
import { awailFaucet } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getFaucetService } from '../../../services/getRequests';

const useFaucet = () => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    mode: 'onBlur',
  });
  const {
    state: { user },
  } = useStateContext();
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [getLoading, setGetLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('GC');
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('GC');
  const [status, setStatus] = useState('success');
  const [active, setActive] = useState(false);
  const [isFaucetClaimed, setIsFaucetClaimed] = useState(false);
  const [verified, setVerified] = useState(false);

  const getFaucet = async () => {
    setGetLoading(true);
    setError(null);
    try {
      const response = await getFaucetService({ currencyCode: currency });
      setData(response?.data);
      setActive(response?.data?.isAvailable);
    } catch (err) {
      setActive(true);
      setError(err.message || 'Something went wrong!');
    } finally {
      setGetLoading(false);
    }
  };
  useEffect(() => {
    getFaucet();
  }, [currency]);

  const onSubmit = async () => {
    if (user?.email) {
      setLoading(true);
      setError(null);
      const data = {
        currencyCode: currency,
      };

      try {
        const response = await awailFaucet(data);
        setMessage(response?.data?.message || 'Claimed Successfully');
        setStatus('success');
        setShowToast(true);
        setIsFaucetClaimed(true);
        setVerified(!verified);
      } catch (apiError) {
        setMessage(apiError.message || 'Something went wrong!');
        setStatus('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    }
  };
  function onChange() {
    setVerified(!verified);
  }

  return {
    t,
    setCurrency,
    data,
    loading,
    getLoading,
    error,
    control,
    handleSubmit,
    showToast,
    message,
    status,
    onSubmit,
    setShowToast,
    active,
    setActive,
    isFaucetClaimed,
    onChange,
    verified,
    user,
  };
};

export default useFaucet;
