
import { getCategoryList, getProviderList } from '@/services/getRequests';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const useProvider = () => {
  const [providerData, setProviderData] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerError, setProviderError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
 

  const params = useParams();
  const providerId = params.id;
  const getProviderGamesList = async () => {
    setProviderLoading(true);
    setProviderError(null);
    try {
      const response = await getProviderList();
      const provider = response?.data?.count.find(
        (game) => game.id === parseInt(providerId)
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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    
  };
  const getCategoryGames = async () => {
    setProviderLoading(true);
    try {
      const response = await getCategoryList();
      const options = response?.data?.casinoCategories.rows
        ?.map((item) => ({
          label: item?.name?.EN,
          value: item?.id,
        }))
        .filter((option) => option.label && option.value);
      setCategoryOptions([{ label: 'All', value: 'all' }, ...options]);
    } catch (err) {
      console.log(err.message);
    } finally {
      setProviderLoading(false);
    }
  };
  useEffect(() => {
    getProviderGamesList();
    getCategoryGames();
  }, []);

 

  return {
    providerLoading,
    providerError,
    providerData,
    selectedCategory,
    categoryOptions,
    handleCategoryChange,
    categoryId: selectedCategory,
 
  };
};

export default useProvider;
