import { gamesByCategory } from '@/services/getRequests';
import { useEffect, useState } from 'react';

function useHome() {
    const [gameData, setGameData] = useState([]);
    const [gameLoading, setGameLoading] = useState(false);
    const [gameError, setGameError] = useState(null);
      const getGames = async () => {
        setGameLoading(true);
        setGameError(null);
        try {
          const response = await gamesByCategory();
          setGameData(() => {
            const updatedData = response?.data?.casinoGames || [];
            return updatedData;
          });
        } catch (err) {
          setGameError(err.message);
        } finally {
          setGameLoading(false);
        }
      };
    
      useEffect(() => {
        getGames();
      }, []);
    
  return {
    gameData,
    gameLoading,
    gameError,
  };
}

export default useHome;