import { getCategoryList, getProviderList } from '@/services/getRequests';
import { useEffect, useState } from 'react';
import { useBreakpoints } from '@/hooks/use-breakpoints';

const useFilter = () => {
  const [providerOptions, setProviderOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { isSmall, isMedium, isLarge, isXLarge, doubleXLarge } = useBreakpoints();
  const defaultLimit =
    (isSmall && 9) || (isMedium && 12) || (isLarge && 20) || (isXLarge && 28) || (doubleXLarge && 28);
 
  const [limit, setLimit] = useState(defaultLimit);

  const handleProviderChange = (value) => {
    setSelectedProvider(value);
    setLimit(defaultLimit);
  };
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setLimit(defaultLimit);
  };

  const getProviderGames = async () => {
    setProviderLoading(true);
    try {
      const response = await getProviderList();
      const options = response?.data?.count
        ?.map((item) => ({
          label: item?.name?.EN,
          value: item?.id,
        }))
        .filter((option) => option.label && option.value);
      setProviderOptions([{ label: 'All', value: 'all' }, ...options]);
    } catch (err) {
      console.log(err.message);
    } finally {
      setProviderLoading(false);
    }
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
    getProviderGames();
    getCategoryGames();
  }, []);

  useEffect(() => {
    setLimit(defaultLimit);
  }, [defaultLimit]);

  return {
    providerLoading,
    providerOptions,
    providerId: selectedProvider,
    categoryId: selectedCategory,
    handleProviderChange,
    categoryOptions,
    handleCategoryChange,
    limit,
    setLimit,
    defaultLimit,
  };
};

export default useFilter;
