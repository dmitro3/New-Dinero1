'use client';
import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import Image from 'next/image';
import PaginationDots from '@/components/ui/pagination-dots';
// import { banners } from '../../constants';
import useBanner from '../../hooks/useBanner';
import { useIsMobile } from '@/hooks/use-mobile';
import { isEmpty } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import { welcomeBonus } from '@/assets/png';
import { Skeleton } from '@/components/ui/skeleton';

const Banner = () => {
  const { selectedIndex, setApi, api, bannerData, bannerLoading } = useBanner();
  const isMobile = useIsMobile();
  // const bannerList = !isEmpty(bannerData) ? bannerData : banners;
  const bannerList = bannerData;

  if (bannerLoading) {
    return (
      <div suppressHydrationWarning={true} className="w-full h-full">
        <Skeleton className="w-full min-h-[200px] md:min-h-[250px] lg:min-h-[300px] max-h-[340px] max-w-[1350px] h-auto mx-1 rounded-lg bg-[rgb(var(--lb-blue-300))]" />
      </div>
    );
  }

  return (
    <>
      {!isEmpty(bannerList) && (
        <Carousel
          className="relative w-full"
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="mx-1 flex">
            {bannerList.map((banner, index) => (
              <CarouselItem
                key={banner.id || index}
                className="relative basis-full md:basis-1/2 lg:basis-1/3 p-2 overflow-hidden cursor-pointer flex justify-center"
                onClick={() => {
                  if (!isEmpty(bannerData) && banner?.redirectUrl) {
                    window.open(banner.redirectUrl, '_blank');
                  }
                }}
              >
                <Image
                  src={
                    (!isEmpty(bannerData) && isMobile
                      ? banner.mobileImageUrl
                      : banner.imageUrl) || welcomeBonus
                  }
                  alt="banner"
                  className="w-[360px] h-[215px] sm:w-full sm:h-full sm:min-h-[200px] sm:max-h-[300px] object-fill rounded-xl object-left"
                  width={2000}
                  height={700}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {!isMobile && (
            <>
              <CarouselPrevious className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-transparent opacity-30 hover:opacity-100 hover:bg-transparent" />
              <CarouselNext className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-transparent opacity-30 hover:opacity-100 hover:bg-transparent" />
            </>
          )}

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
            <PaginationDots
              selectedIndex={selectedIndex}
              slideCount={bannerList.length}
              onDotClick={(index) => api && api.scrollTo(index)}
            />
          </div>
        </Carousel>
      )}
    </>
  );
};

export default Banner;
