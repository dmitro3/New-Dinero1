'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addLoginToken } from '@/services/storageUtils';

const SSOSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleToken = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('SSO Error:', error);
        setStatus('error');
        setTimeout(() => {
          window.location.href = '/?error=sso_failed';
        }, 2000);
        return;
      }

      if (token) {
        try {
          // Store the token in localStorage using the proper function
          if (typeof window !== 'undefined') {
            addLoginToken(token);
            console.log('Token stored successfully');
            
            // Dispatch a custom event to notify other components about the token change
            window.dispatchEvent(new Event('storage'));
            
            // Add a small delay to ensure token is properly stored before any API calls
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          setStatus('success');
          
          // Use setTimeout to show success state briefly before redirect
          setTimeout(() => {
            // Use Next.js router for a smoother redirect without hard refresh
            router.push('/');
          }, 1500);
          
        } catch (error) {
          console.error('Token processing error:', error);
          setStatus('error');
          setTimeout(() => {
            window.location.href = '/?error=token_invalid';
          }, 2000);
        }
      } else {
        // No token received, redirect to login
        setStatus('error');
        setTimeout(() => {
          window.location.href = '/?error=no_token';
        }, 2000);
      }
    };

    handleToken();
  }, [searchParams, router]);

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return 'Login successful! Redirecting...';
      case 'error':
        return 'An error occurred. Redirecting...';
      default:
        return 'Processing your login...';
    }
  };

  const getSpinnerColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      default:
        return 'border-blue-500';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${getSpinnerColor()} mx-auto`}></div>
        <p className="text-white mt-4">{getStatusMessage()}</p>
        {status === 'success' && (
          <p className="text-green-400 text-sm mt-2">Token stored successfully</p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-sm mt-2">Please wait while we redirect you...</p>
        )}
      </div>
    </div>
  );
};

export default SSOSuccess; 