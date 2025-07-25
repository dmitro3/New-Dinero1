'use client';

import { useParams } from 'next/navigation';

const { getCmsPageDetail } = require('@/services/getRequests');
const { useState, useEffect } = require('react');

const useCmsDetails = () => {
  const [cmsDetails, setCmsDetails] = useState([]);
  const [cmsLoading, setCmsLoading] = useState(false);
  const [cmsError, setCmsError] = useState(null);
 const params = useParams();
 const cmsSlug = params?.slug;
  const getCmsDetail = async () => {
    setCmsLoading(true);
    setCmsError(null);
    try {
      const response = await getCmsPageDetail({cmsSlug});
      setCmsDetails(response?.data?.cmsDetails);
    } catch (err) {
      setCmsError(err.message);
    } finally {
      setCmsLoading(false);
    }
  };
  useEffect(() => {
    getCmsDetail();
  }, []);

  return {
    cmsDetails,
    cmsLoading,
    cmsError,
  };
};
export default useCmsDetails;
