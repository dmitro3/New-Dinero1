import { KYCVerify } from '@/services/getRequests';
import { useStateContext } from '@/store';
import { useState } from 'react';

function useVerifyKyc() {
  const {
    state: { user },
  } = useStateContext();

  const [toastState, setToastState] = useState({
    showToast: false,
    message: '',
    status: '',
  });
  const { showToast, message, status } = toastState;

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