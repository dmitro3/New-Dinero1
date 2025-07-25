'use client';
import { vipBanner } from '@/assets/svg';
import Image from 'next/image';

const VipBanner = () => {
  return (
    <>
      <Image
        src={vipBanner}
        alt="banner"
        // className="object-fit w-full h-full max-h-[250] md:max-h-[290] lg:max-h-[350] xl:max-h-[480] rounded-lg"
      />
    </>
  );
};

export default VipBanner;
