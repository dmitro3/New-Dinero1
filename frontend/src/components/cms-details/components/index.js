'use client';
import CustomOrionStarLoading from '@/common/components/custom-orionstar-loading';
import useCmsDetails from '../hooks/useCmsDetails';
import { useEffect } from 'react';

const CmsDetails = () => {
  const { cmsDetails, cmsLoading } = useCmsDetails();
  useEffect(() => {
    // eslint-disable-next-line
    window.scrollTo(0, 0);
  }, [cmsDetails, cmsLoading]);
  if (cmsLoading) return <CustomOrionStarLoading />;
  return (
    <div className="p-5 bg-[hsl(var(--main-background))] ">
      <h1 className="text-xl text-white mb-3 font-extrabold  ">
        {cmsDetails?.title?.EN}
      </h1>
      <div
        className="text-white text-sm bg-[rgb(var(--lb-blue-900))] p-5 text-wrap break-words"
        dangerouslySetInnerHTML={{ __html: cmsDetails?.content }}
      />
    </div>
  );
};

export default CmsDetails;
