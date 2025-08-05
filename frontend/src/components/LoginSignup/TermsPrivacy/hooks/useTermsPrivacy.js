'use client';
import { getCmsPageDetail } from '@/services/getRequests';
import { useState } from 'react';

const useTermsPrivacy = () => {
  const [termsPrivacyLoading, setTermsPrivacyLoading] = useState(false);
  const [termsData, setTermsData] = useState([]);
  const [privacyData, setPrivacyData] = useState([]);

  const fetchContent = async (type) => {
    setTermsPrivacyLoading(true);
    try {
      const payload = {
        cmsSlug: type === 'terms' ? 'general-terms' : 'privacy-policy',
      };
      const response = await getCmsPageDetail(payload);
      const content = response?.data?.cmsDetails?.content;
      
      if (type === 'terms') {
        setTermsData(content);
      } else {
        setPrivacyData(content);
      }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            // console.log(err);
      if (type === 'terms') {
        setTermsData('');
      } else {
        setPrivacyData('');
      }
    } finally {
      setTermsPrivacyLoading(false);
    }
  };

  return {
    termsPrivacyLoading,
    termsData,
    privacyData,
    fetchTerms: () => fetchContent('terms'),
    fetchPrivacyPolicy: () => fetchContent('privacy'),
  };
};

export default useTermsPrivacy;
