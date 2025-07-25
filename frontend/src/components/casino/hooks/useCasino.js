import { removeFav } from '@/services/deleteRequest';
import { getAllGames } from '@/services/getRequests';
import { addFav } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';

const useCasino = ({ providerId, categoryId, limit }) => {
  const [gameData, setGameData] = useState([]);
  const [gameLoading, setGameLoading] = useState(false);
  const [gameError, setGameError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const {
    state: { user },
  } = useStateContext();

  const getGames = async () => {
    setGameLoading(true);
    setGameError(null);
    if (!isLoadMore) setGameData([]);
    try {
      const payload = {
        limit,
        pageNo,
        provider: providerId && providerId !== 'all' ? providerId : '',
        category: categoryId && categoryId !== 'all' ? categoryId : '',
      };
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
    if (limit) {
      getGames();
    }
  }, [pageNo, limit, providerId, categoryId]);

  return {
    formateData: gameData,
    gameError,
    gameLoading,
    setPageNo,
    handleFavoriteGame,
    totalCount,
    onLoadMore,
  };
};

export default useCasino;
