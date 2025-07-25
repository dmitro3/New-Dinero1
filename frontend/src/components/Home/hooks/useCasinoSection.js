// import { favourite } from '@/assets/svg';
import { useIsMobile } from '@/hooks/use-mobile';
import { removeFav } from '@/services/deleteRequest';
import { addFav } from '@/services/postRequest';
import { useStateContext } from '@/store';
import useEmblaCarousel from 'embla-carousel-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

function useCasinoSection({ setGameData = () => {} }) {
  const isMobile = useIsMobile();
  // const defualtLimit = isMobile ? 10 :  15;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: true,
  });
  // const [gameData, setGameData] = useState([]);
  // const [gameLoading, setGameLoading] = useState(true);
  // const [gameError, setGameError] = useState(null);
  // const [pageNo, setPageNo] = useState(1);
  //const [canScrollPrev, setCanScrollPrev] = useState(false);
  //const [canScrollNext, setCanScrollNext] = useState(false);
  // const [limit, setLimit] = useState(defualtLimit);
  const router = useRouter();
  const {
    state: { user, rightPanel },
  } = useStateContext();
  const defaultLoadingCount = isMobile ? 3 : rightPanel ? 8 : 6;
  // setLimit(defualtLimit);

  const handleFav = async ({ gameId, isFav }) => {
    if (isFav) {
      await removeFav({
        casinoGameId: gameId,
        userId: user?.userId,
      });
      setGameData((prev) =>
        prev.map((game) =>
          game.id === gameId ? { ...game, isFavorite: false } : game
        )
      );
    } else {
      try {
        await addFav({
          casinoGameId: gameId,
          userId: user?.userId,
        });
        setGameData((prev) =>
          prev.map((game) =>
            game.id === gameId ? { ...game, isFavorite: true } : game
          )
        );
      } catch (error) {
        console.log('error', error);
      }
    }
  };
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {});
      emblaApi.on('reInit', () => {});
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    const slideCount = emblaApi.slideNodes().length;
    const currentIndex = emblaApi.selectedScrollSnap();
    const nextIndex = currentIndex + 3;

    if (nextIndex >= slideCount) {
      const wrapIndex = nextIndex % slideCount;
      emblaApi.scrollTo(wrapIndex);
    } else {
      emblaApi.scrollTo(nextIndex);
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    const slideCount = emblaApi.slideNodes().length;
    const currentIndex = emblaApi.selectedScrollSnap();
    const prevIndex = currentIndex - 3;

    if (prevIndex < 0) {
      const wrapIndex = slideCount + prevIndex;
      emblaApi.scrollTo(wrapIndex);
    } else {
      emblaApi.scrollTo(prevIndex);
    }
  }, [emblaApi]);

  const handleFavoriteGame = (gameId, isFav) => {
    handleFav({ gameId, isFav });
  };
  const clickHandler = ({ categoryId }) => {
    router.push(`/category/${categoryId}`);
  };

  return {
    emblaRef,
    scrollNext,
    scrollPrev,
    handleFavoriteGame,
    // setPageNo,
    // setLimit,
    // canScrollNext,
    // canScrollPrev,
    clickHandler,
    defaultLoadingCount,
  };
}

export default useCasinoSection;
