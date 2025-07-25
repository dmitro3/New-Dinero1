
import { FOOTER_IMG_LIST, GLOBAL_PROMOTION_LIST } from '@/components/footer/constants';
import Image from 'next/image';
import React from 'react';

const GlobalPromotion = () => {
  return (
    <>
      <div className="container mx-auto px-4 font-bold mt-4 border-t border-neutral-600">
        <h1 className="my-3 text-white text-center">Global Promotions</h1>
        <div className="flex flex-wrap">
          {GLOBAL_PROMOTION_LIST.map((media) => (
            <div key={media.alt} className="flex justify-between m-2">
              <Image src={media.img} alt={media.alt} className="" />
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 font-bold mt-4 border-t border-neutral-600">
        <div className="flex flex-wrap">
          {FOOTER_IMG_LIST.map((media) => (
            <div key={media.alt} className="flex justify-between m-2">
              <Image src={media.img} alt={media.alt} className="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GlobalPromotion;
