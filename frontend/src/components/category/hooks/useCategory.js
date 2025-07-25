import { getCategoryList } from '@/services/getRequests';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const useCategory = () => {
  const [providerData, setProviderData] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerError, setProviderError] = useState(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  // const providerId = params.id;
  const categoryId = id ? id : params?.id;
  const getProviderGamesList = async () => {
    setProviderLoading(true);
    setProviderError(null);
    try {
      const response = await getCategoryList();
      
      const provider = response?.data?.casinoCategories.rows.find(
        (game) => game.id === parseInt(categoryId)
      );
      if (provider) {
        setProviderData(provider);
      }
    } catch (err) {
      setProviderError(err.message);
    } finally {
      setProviderLoading(false);
    }
  };

  useEffect(() => {
    getProviderGamesList();
  }, []);

  return {
    providerLoading,
    providerError,
    providerData,
  };
};

export default useCategory;
