import { useState, useEffect, useCallback } from 'react';
import { getPlaidLinkToken } from '@/services/postRequest';
import { exchangePlaidToken } from '@/services/postRequest';
import { getAccount } from '@/services/getRequests';

export function useBankTransfer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [linkToken, setLinkToken] = useState(null);
  const [plaidLoaded, setPlaidLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState('ready');
  const [accountsInfo, setAccountsInfo] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastStatus, setToastStatus] = useState('success');

  const fetchLinkToken = async () => {
    try {
      const response = await getPlaidLinkToken();
      const token = response?.data?.data?.link_token;
      if (!token) {
        throw new Error(response.error || 'Failed to get Plaid link token');
      }
      setLinkToken(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserAccounts = useCallback(async () => {
    try {
      const response = await getAccount({ paymentType: 'ACH' });
      if (!response)
        throw new Error(response.errors || 'Failed to fetch accounts');
      // if (!Array.isArray(response?.data))
      //   throw new Error('Invalid accounts data format');

      setAccountsInfo(response.data);
      setCurrentStep('ready');
      return response?.data;
    } catch (error) {
      setError(error.message);
      setCurrentStep('ready');
      return [];
    }
  }, []);

  // Load Plaid script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (window.Plaid) {
      setPlaidLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;

    script.onload = () => {
      setPlaidLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Plaid. Please refresh the page.');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const exchangeToken = useCallback(async (publicToken) => {
    try {
      const response = await exchangePlaidToken({ publicToken });

      const { paymentDetailId } = response.data;
      await fetchUserAccounts();
      
      setToastStatus(response?.data?.success ? 'success' : 'error');
      setToastMessage(response?.data?.message);
      

      return { paymentDetailId, bankDetails: response.data };
    } catch (error) {
      setError(error.message);
      setCurrentStep('ready');
      throw error;
    }
    finally{
      setShowToast(true);
    }
  }, []);

  const makeAchPayment = useCallback(async (paymentDetailId) => {
    try {
      setCurrentStep('payment');
      setError(null);

      const response = await makeAchPayment(paymentDetailId);
      if (!response.ok) throw new Error(response.error || 'ACH payment failed');

      setSuccess(true);
      setCurrentStep('complete');
      return response.data;
    } catch (error) {
      setError(error.message);
      setCurrentStep('ready');
      throw error;
    }
  }, []);

  const openPlaid = useCallback(() => {
    if (!plaidLoaded || !linkToken) {
      setError('Plaid is still loading or token missing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setCurrentStep('plaid');

    const handler = window.Plaid.create({
      token: linkToken,
      env: 'sandbox',
      onSuccess: async (publicToken) => {
        try {
          const response = await exchangeToken(publicToken);

          setToastStatus(response?.bankDetails.success ? 'success' : 'error');
          setToastMessage(response?.bankDetails.message);
          
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
          setShowToast(true);
        }
      },
      onExit: () => {
        setLoading(false);
        setCurrentStep('ready');
        // setError(err?.display_message || err?.message || 'Exited Plaid');
      },
      onEvent: (eventName, metadata) => {
        console.log('Plaid event:', eventName, metadata);
      },
    });

    handler.open();
  }, [plaidLoaded, linkToken, exchangeToken]);

  const selectAccountAndPay = useCallback(
    async (paymentDetailId) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const result = await makeAchPayment(paymentDetailId);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeAchPayment]
  );

  return {
    openPlaid,
    loading,
    error,
    success,
    currentStep,
    plaidLoaded,
    accountsInfo,
    selectAccountAndPay,
    fetchLinkToken,
    showToast,
    setShowToast,
    toastMessage,
    setToastMessage,
    toastStatus,
    setToastStatus,
  };
}
