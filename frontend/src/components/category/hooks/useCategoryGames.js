import { useBreakpoints } from '@/hooks/use-breakpoints';
import { removeFav } from '@/services/deleteRequest';
import { getAllGames } from '@/services/getRequests';
import { addFav } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const useProviderGames = () => {
  const [gameData, setGameData] = useState([]);
  const [gameLoading, setGameLoading] = useState(false);
  const [gameError, setGameError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const { isSmall, isMedium, isLarge, isXLarge, doubleXLarge } =
    useBreakpoints();
  const defaultLimit =
    (isSmall && 9) ||
    (isMedium && 12) ||
    (isLarge && 20) ||
    (isXLarge && 28) ||
    (doubleXLarge && 28);

  const [limit, setLimit] = useState(defaultLimit);
  const params = useParams();

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const {
    state: { user },
  } = useStateContext();

  const getGames = async () => {
    const category = id ? id : params?.id;
    const payload = { limit: limit, pageNo: pageNo, category };
    setGameError(null);
    try {
      setGameLoading(true);
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
    }
  };

  useEffect(() => {
    if (limit) {
      getGames();
    }
  }, [pageNo, limit]);

  const loadMore = () => {
    setPageNo(pageNo + 1);
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
    if (limit !== defaultLimit) {
      setLimit(defaultLimit);
    }
  }, [defaultLimit]);

  return {
    formateData: gameData,
    gameError,
    gameLoading,
    setPageNo,
    setLimit,
    handleFavoriteGame,
    pageNo,
    limit,
    totalCount,
    defaultLimit,
    loadMore,
  };
};

export default useProviderGames;
