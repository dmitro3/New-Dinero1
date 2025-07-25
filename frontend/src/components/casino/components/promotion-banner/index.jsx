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
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import useCasinoBanner from '../../hooks/useCasinoBanner';
import { banners } from '../../constants';
import { welcomeBonus } from '@/assets/png';

const CasinoBanner = () => {
  const { selectedIndex, setApi, api, bannerData } = useCasinoBanner();
  const isMobile = useIsMobile();
  const bannerList = !isEmpty(bannerData) ? bannerData : banners;

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
                className="relative basis-full md:basis-1/2 lg:basis-1/3 p-2 overflow-hidden min-h-[300px] cursor-pointer"
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
                  className="w-full min-h-[200px] max-h-[300px] sm:h-auto object-fill sm:object-fill rounded-xl object-left"
                  width={2000}
                  height={700}
                />
                <div className="absolute inset-0 flex flex-col justify-end sm:justify-start pt-12 sm:pt-16 px-4 sm:px-8 pb-6 sm:pb-8 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                  <h1 className="text-zinc-100 text-2xl sm:text-4xl font-semibold sm:font-bold max-w-full sm:max-w-xl leading-tight sm:leading-snug break-words line-clamp-2">
                    {banner?.title?.EN || ''}
                  </h1>
                  {/* <p className="text-zinc-200 mt-2 text-sm sm:text-base font-normal max-w-full sm:max-w-xl leading-snug break-words line-clamp-3">
                    {banner?.description?.EN || ''}
                  </p> */}
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

export default CasinoBanner;
