import { removeFav } from '@/services/deleteRequest';
import { getAllGames } from '@/services/getRequests';
import { addFav } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBreakpoints } from '@/hooks/use-breakpoints';

const useProviderGames = ({ categoryId }) => {
  const [gameData, setGameData] = useState([]);
  const [gameLoading, setGameLoading] = useState(false);
  const [gameError, setGameError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const { isSmall, isMedium, isLarge, isXLarge, doubleXLarge } =
    useBreakpoints();
  const defaultLimit =
    (isSmall && 9) ||
    (isMedium && 12) ||
    (isLarge && 20) ||
    (isXLarge && 28) ||
    (doubleXLarge && 28);

  const [limit, setLimit] = useState(9);

  const params = useParams();
  const provider = params.id;
  const {
    state: { user },
  } = useStateContext();

  // let payload;
  // if (categoryId) {
  //   payload = { limit: limit, pageNo: pageNo, category: categoryId, provider };
  // } else {
  //   payload = { limit: limit, pageNo: pageNo, provider };
  // }
  const payload = {
    limit,
    pageNo,
    provider,
    category: categoryId && categoryId !== 'all' ? categoryId : '',
  };

  const getGames = async () => {
    setGameLoading(true);
    setGameError(null);
    if (!isLoadMore) setGameData([]);
    try {
      const response = await getAllGames(payload);
      setGameData((prev) => {
        const newData = [
          ...prev,
          ...(response?.data?.categoryGames?.rows || []),
        ];

        return newData.reduce((acc, item) => {
          if (!acc.some((i) => i.id === item.id)) {
            acc.push(item);
          }
          return acc;
        }, []);
      });
      setTotalCount(response?.data?.categoryGames?.count);
    } catch (err) {
      setGameError(err.message);
    } finally {
      setGameLoading(false);
      setIsLoadMore(false);
    }
  };

  const onLoadMore = () => {
    setPageNo(pageNo + 1);
    setIsLoadMore(true);
  };

  const handleFav = async ({ gameId, isFav }) => {
    if (isFav) {
      await removeFav({
        casinoGameId: gameId,
        userId: user?.userId,
      });
      const updatedGames = gameData.map((game) =>
        game.id === gameId ? { ...game, isFavorite: !isFav } : game
      );
      setGameData(updatedGames);
    } else {
      await addFav({
        casinoGameId: gameId,
        userId: user?.userId,
      });
      const updatedGames = gameData.map((game) =>
        game.id === gameId ? { ...game, isFavorite: !isFav } : game
      );
      setGameData(updatedGames);
    }
  };
  const handleFavoriteGame = (gameId, isFav) => {
    handleFav({ gameId, isFav });
  };

  useEffect(() => {
    setLimit(defaultLimit);
  }, [defaultLimit]);

  useEffect(() => {
    if (limit) {
      getGames();
    }
  }, [provider, defaultLimit, pageNo, categoryId]);

  return {
    formateData: gameData,
    gameError,
    gameLoading,
    setPageNo,
    setLimit,
    handleFavoriteGame,
    totalCount,
    onLoadMore,
  };
};

export default useProviderGames;
