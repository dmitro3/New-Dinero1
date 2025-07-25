'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { getBannersService } from '../../../services/getRequests';

function usePromotionBanner() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState(null);
  const [bannerData, setBannerData] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerError, setBannerError] = useState(null);

  const getBanner = async () => {
    setBannerLoading(true);
    setBannerError(null);
    try {
      const response = await getBannersService({ key: 'promotion' });
      setBannerData(response?.data?.banners?.rows);
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };
  useEffect(() => {
    getBanner();
  }, []);

  const onSelect = useCallback(() => {
    if (api) {
      setSelectedIndex(api.selectedScrollSnap());
    }
  }, [api]);

  React.useEffect(() => {
    if (!api) return;
    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api, onSelect]);

  const getItemClassName = (length) => {
    if (length === 1) return 'basis-full';
    if (length === 2) return 'basis-1/2';
    return 'sm:basis-1/2 md:basis-1/3';
  };
  return {
    selectedIndex,
    setApi,
    api,
    bannerData,
    bannerError,
    bannerLoading,
    getItemClassName,
  };
}

export default usePromotionBanner;
