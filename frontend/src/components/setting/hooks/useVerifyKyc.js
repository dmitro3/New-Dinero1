import { KYCVerify, getUserDetails } from '@/services/getRequests';
import { useStateContext } from '@/store';
import { useState, useEffect, useRef } from 'react';

function useVerifyKyc() {
  const {
    state: { user },
    dispatch,
  } = useStateContext();

  const [toastState, setToastState] = useState({
    showToast: false,
    message: '',
    status: '',
  });
  const { showToast, message, status } = toastState;

  const pollingIntervalRef = useRef(null);

  const handleVerifyKYC = async () => {
    try {
      const res = await KYCVerify();

      const verificationUrl = res?.data?.verification?.url;

      if (window && verificationUrl) {
        window.location.href = verificationUrl;
      } else {
        console.warn('Verification URL is missing:', res);
      }
    } catch (error) {
      console.error('handleVerifyKYC -> error', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await getUserDetails();
      if (response?.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const startPolling = () => {
    if (pollingIntervalRef.current) return; // Already polling

    pollingIntervalRef.current = setInterval(() => {
      fetchUserDetails();
    }, 30000); // Poll every 30 seconds
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const currentStatus = user?.veriffStatus;
    const isFinalStatus = currentStatus === 'approved' || currentStatus === 'declined';

    if (!isFinalStatus && user) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [user?.veriffStatus, user]);

  return {
    handleVerifyKYC,
    veriffStatus: user?.veriffStatus || null,
    user,
    showToast,
    setToastState,
    message,
    status,
  };
}

export default useVerifyKyc;