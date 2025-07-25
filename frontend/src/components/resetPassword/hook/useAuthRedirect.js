import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/services/storageUtils';

const useAuthRedirect = () => {
  const router = useRouter();
  const isToken = getAccessToken();

  useEffect(() => {
    if (isToken) {
      router.push('/');
    }
  }, [isToken, router]);
};

export default useAuthRedirect;
