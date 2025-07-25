import { getTopThreePlayers } from '@/services/getRequests';
import { getAccessToken } from '@/services/storageUtils';
import { useEffect, useState } from 'react';

const useTopThreePlayers = () => {
  const [topPlayersData, setTopPlayersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = getAccessToken();

  const fetchMyPlay = async () => {
    try {
      const response = await getTopThreePlayers();
      setTopPlayersData(response?.data?.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyPlay();
  }, []);
  return { topPlayersData, loading, error };
};

export default useTopThreePlayers;
