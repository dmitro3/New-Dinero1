'use client';
import { getCmsPageList } from '@/services/getRequests';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const useCms = () => {
  const [cmsData, setCmsData] = useState([]);
  const [cmsLoading, setCmsLoading] = useState(false);
  const [cmsError, setCmsError] = useState(null);

  const router = useRouter();

  const handleOnClick = (value) => {
    // console.log('Navigating to CMS page:', value);
    router.push(`/${value}`);
  };

  const getCms = async () => {
    setCmsLoading(true);
    setCmsError(null);

    try {
      const response = await getCmsPageList();
      const cmsContent = response?.data || {};

      const cmsDetailsArray = cmsContent.cmsDetails || [];

      setCmsData(structuredClone(cmsDetailsArray));
    } 
    catch (err) {
      console.error('Error fetching CMS data:', err);
      setCmsError(err.message);
    } finally {
      setCmsLoading(false);
    }
  };

  useEffect(() => {
    getCms();
  }, []);

  return {
    cmsData,
    cmsError,
    cmsLoading,
    handleOnClick,
  };
};

export default useCms;
