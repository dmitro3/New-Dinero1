import { getBannerDownload } from '@/services/getRequests';
import { useStateContext } from '@/store';
import { useState } from 'react';
import { REF_LINK } from '../constant';

const useStart = () => {
  const {
    state: { user },
  } = useStateContext();

  const [toastState, setToastState] = useState({
    showToast: false,
    message: '',
    status: '', // success or error
  });

  const { showToast, message, status } = toastState;

  const refLink = user ? REF_LINK + user.username : 'Getting your link...';
  const handleClick = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const response = await getBannerDownload(); 
      const s3_url = response?.data?.bannerLinks;
      const res = await fetch(s3_url);
      const blob = await res.blob();
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = 'banners.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const handleCopy = async () => {
    if (typeof window === 'undefined') return;
    
    /* eslint-disable */
    if (window && window.isSecureContext && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(refLink);
        setToastState({
          showToast: true,
          message: 'Referral link copied successfully!',
          status: 'success',
        });
      } catch (err) {
        setToastState({
          showToast: true,
          message: err.message,
          status: 'error',
        });
      }
    } else {
      // Fallback for non-secure contexts or unsupported Clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = refLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setToastState({
        showToast: true,
        message: 'Referral link copied successfully!',
        status: 'success',
      });
    }
    /* eslint-enable */
  };
  return {
    handleClick,
    handleCopy,
    showToast,
    message,
    status,
    refLink,
    setToastState,
  };
};

export default useStart;
