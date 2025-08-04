'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addLoginToken } from '@/services/storageUtils';

const SSOCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('SSO Error:', error);
      router.push('/?error=sso_failed');
      return;
    }

    if (token) {
      try {
        // Store the token
        addLoginToken(token);
        
        // You can also decode the token to get user info if needed
        // const decodedToken = jwt_decode(token);
        
        // Redirect to home page or dashboard
        router.push('/');
      } catch (error) {
        console.error('Token processing error:', error);
        router.push('/?error=token_invalid');
      }
    } else {
      // No token received, redirect to login
      router.push('/?error=no_token');
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="text-white mt-4">Processing your login...</p>
      </div>
    </div>
  );
};

export default SSOCallback; 