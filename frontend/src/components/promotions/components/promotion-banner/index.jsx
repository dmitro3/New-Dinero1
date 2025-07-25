'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import PaginationDots from '@/components/ui/pagination-dots';
import { useIsMobile } from '@/hooks/use-mobile';
import { isEmpty } from '@/lib/utils';
import Image from 'next/image';
import { banners } from '../../constant';
import usePromotionBanner from '../../hooks/usePromotionBanner';
import Autoplay from 'embla-carousel-autoplay';
import { welcomeBonus } from '@/assets/png';

const PromotionBanner = () => {
  const { selectedIndex, setApi, api, bannerData } =
    usePromotionBanner();
  const isMobile = useIsMobile();
  const bannerList=!isEmpty(bannerData)?bannerData:banners;
 
  

  return (
    <>
      {!isEmpty(bannerList) && (
        <Carousel
          className="relative w-full mb-4"
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
          <CarouselContent className="flex ml-0">
            {bannerList.map((banner, index) => (
              <CarouselItem
                key={banner.id || index}
                className="relative lg:basis-1/3  md:basis-1/2 p-2 overflow-hidden min-h-[300px] cursor-pointer"
                onClick={() =>{if (!isEmpty(bannerData) && banner?.redirectUrl) {
                  window.open(banner.redirectUrl, '_blank'); 
                }}}
              >
                <Image
                  src={((!isEmpty(bannerData) && isMobile)?banner.mobileImageUrl:banner.imageUrl)||welcomeBonus}
                  alt="banner"
                  className="w-full min-h-[150px] sm:min-h-[200px] max-h-[300px] sm:h-auto object-fill sm:object-fill rounded-xl object-left"
                  width={2000}
                  height={700}
                />
                <div className="absolute inset-0 flex flex-col items-start justify-start px-4 pt-2 sm:px-6 sm:pt-6">
                  <h1 className="text-zinc-100 text-xs sm:text-lg md:text-2xl lg:text-3xl font-bold pt-10 sm:pt-8 mx-4 sm:mx-6 max-w-[80%] leading-tight">
                     {banner?.title?.EN || ''}
                  </h1>
                  <p className="text-zinc-200 text-[10px] sm:text-xs md:text-base lg:text-lg mx-4 sm:mx-6 mt-2 max-w-[80%]">
                   {banner?.description?.EN || ''}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {!isMobile && (
            <>
              <CarouselPrevious
                className={`absolute -left-6 top-1/2 transform -translate-y-1/2 bg-transparent opacity-30 hover:opacity-100 hover:bg-transparent ${bannerList.length < 3 && 'hidden'}`}
              />
              <CarouselNext
                className={`absolute -right-6 top-1/2 transform -translate-y-1/2 bg-transparent opacity-30 hover:opacity-100 hover:bg-transparent ${bannerList.length < 3 && 'hidden'}`}
              />
            </>
          )}
          <div className="absolute -mt-6 left-1/2 transform -translate-x-1/2 z-10">
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

export default PromotionBanner;
