import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getGamePlay } from '@/services/getRequests';
import { useStateContext } from '@/store';

const useGamePlay = () => {
  const [gamePlayData, setGamePlayData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameTypeSelected, setIsGameTypeSelected] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [error, setError] = useState(null); // <-- just use this, no need for isError separately

  const { gameId } = useParams();
  const {
    state: { selectedCoin },
  } = useStateContext();

  const handleIsDemo = (type) => {
    setIsDemo(type);
    setIsGameTypeSelected(true);
    setError(null); // Clear error on new selection
  };

  const fetchGamePlay = async () => {
    if (!gameId) return;

    setIsLoading(true);
    setError(null); // Reset error before fetching
    setGamePlayData(null); // Reset gamePlayData before reloading

    try {
      const payload = {
        gameId,
        coinType: selectedCoin === 'gold' ? 'GC' : 'SC',
        isDemo: isDemo,
      };

      const response = await getGamePlay(payload);

      // If API returns an error inside the response
      if (response?.error || response?.data?.error) {
        setError(response?.error || response?.data?.error || 'Unknown error occurred');
        setGamePlayData(null);
      } else {
        setGamePlayData(response?.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
      setGamePlayData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGamePlay();
  }, [gameId, isDemo, selectedCoin]);

  return {
    gamePlayData,
    isLoading,
    isGameTypeSelected,
    handleIsDemo,
    isDemo,
    error, // <-- return only error string
  };
};

export default useGamePlay;
