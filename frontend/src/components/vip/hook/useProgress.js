import { getVipService } from '@/services/getRequests';
import { useStateContext } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const useProgress = ({ handleDialogClose }) => {
  const router = useRouter();
  const {
    state: { user },
    dispatch,
  } = useStateContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getVipRewards = async () => {
    setLoading(true);
    try {
      const response = await getVipService();
      setData(response?.data?.data?.vipTiers?.rows);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleClick = () => {
    router.push('/vip-rules');
    dispatch({
      type: 'SET_LEFT_PANEL',
      payload: false,
    });
    handleDialogClose();
  };
  useEffect(() => {
    if(user)
    getVipRewards();
  }, [user]);
  return { user, data, loading, handleClick };
};

export default useProgress;
