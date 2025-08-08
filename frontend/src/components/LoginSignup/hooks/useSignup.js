'use client';
import { useEffect, useState } from 'react';
import { getBannersService } from '@/services/getRequests';

function useSignup() {
  const [signupData, setSignupData] = useState([]);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);

  const getSignupAssets = async () => {
    setSignupLoading(true);
    setSignupError(null);
    try {
      console.log("hello signup here")
      const response = await getBannersService({ key: 'other' });
      setSignupData(response?.data?.banners?.rows || []);
    } catch (err) {
      setSignupError(err.message);
    } finally {
      setSignupLoading(false);
    }
  };

  useEffect(() => {
    getSignupAssets();
  }, []);
console.log(signupData)
  return {
    signupData,
    signupError,
    signupLoading,
  };
}

export default useSignup;
