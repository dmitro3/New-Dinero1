import { removeFav } from '@/services/deleteRequest';
import { getFavGameList } from '@/services/getRequests';
import { addFav } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useFavourite = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  //const [favSucess, setFavSucess] = useState(false);
  const [totalCount, setTotalCount] = useState(false);
  const {
    state: { user },
  } = useStateContext();

  const fetchFavGameList = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = { limit, pageNo };
      const response = await getFavGameList(payload);
      setData((prev) => {
        const newData = [
          ...prev,
          ...(response?.data?.favoriteGames?.rows || []),
        ];

        return newData.reduce((acc, item) => {
          if (!acc.some((i) => i.id === item.id)) {
            acc.push(item);
          }
          return acc;
        }, []);
      });

      setTotalCount(response?.data?.favoriteGames?.count);
      // if (totalCount < limit) {
      //   setLimit(totalCount);
      // }
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPageNo(pageNo + 1);
  };

  const handleFav = async ({ gameId, isFav }) => {
    if (isFav) {
      await removeFav({
        casinoGameId: gameId,
        userId: user?.userId,
      });
      
      setData((prevData) => prevData.filter((game) => game.CasinoFavoriteGames.id !== gameId));
    } else {
      await addFav({
        casinoGameId: gameId,
        userId: user?.userId,
      });
      const updatedGames = data.map((game) =>
        game.CasinoFavoriteGames.id === gameId ? { ...game, isFavorite: !isFav } : game
      );
      setData(updatedGames);
    }
  };
  const handleFavoriteGame = (gameId, isFav) => {
    handleFav({ gameId, isFav });
  };

  useEffect(() => {
    fetchFavGameList();
  }, [limit, pageNo]);

  return {
    t,
    data,
    loading,
    error,
    handleFavoriteGame,
    setPageNo,
    setLimit,
    limit,
    totalCount,
    loadMore,
  };
};

export default useFavourite;
