import { MEDIA_PROMOTION_LIST } from '@/components/footer/constants';
import Image from 'next/image';
import React from 'react';

const MediaPromotion = () => {
  return (
    <div className="container mx-auto px-4 text-white font-bold mt-4 border-t border-neutral-600">
      <h1 className="my-3 text-white text-center">Media Promotions</h1>
      <div className="flex flex-wrap">
        {MEDIA_PROMOTION_LIST.map((media) => (
          <div key={media.alt} className="flex justify-between m-2">
            <Image src={media.img} alt={media.alt} className="cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPromotion;
