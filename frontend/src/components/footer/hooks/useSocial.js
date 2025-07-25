'use client';
import { getSocial } from '@/services/getRequests';
import { useEffect, useState } from 'react';

const useSocial = () => {
  const [socialLinks, setSocialLinks] = useState(null);

  const fetchSocialLinks = async () => {
    try {
      const response = await getSocial();
      const extractedSocialLinks = response?.data?.socialMediaLinks || {};
      setSocialLinks(structuredClone(extractedSocialLinks));
    } catch (err) {
      console.error('Failed to fetch social links:', err.message);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  return { socialLinks };
};

export default useSocial;
