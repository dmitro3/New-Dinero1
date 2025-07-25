import { getVipService } from '@/services/getRequests';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';
import { PROGRESS_FIELDS } from '../constant';
import useGetUserDeatil from '@/common/hook/useGetUserDeatil';
import { getAccessToken } from '@/services/storageUtils';

const useVip = () => {
  const {
    state: { user, rightPanel },
  } = useStateContext();
  const [data, setData] = useState([]);
  const token = getAccessToken();

  const [loading, setLoading] = useState(true);
  const [fieldProgress, setFieldProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const { getUser } = useGetUserDeatil();

  const getVipRewards = async () => {
    setLoading(true);
    try {
      const response = await getVipService();
      setData(response?.data?.data?.vipTiers?.rows || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (currentTier, nextTier) => {
    if (!currentTier || !nextTier) return { overall: 0, progressPerField: [] };

    let totalProgress = 0;
    let fieldsCount = 0;
    const progressPerField = [];

    PROGRESS_FIELDS.forEach(({ name, value }) => {
      const currentValue = currentTier[value] || 0;
      const nextValue = nextTier[value];

      if (nextValue > 0) {
        const fieldProgress = Math.min((currentValue / nextValue) * 100, 100);
        progressPerField.push({
          name,
          progress: fieldProgress,
          value,
          currentValue,
          nextValue,
        });
        totalProgress += fieldProgress;
        fieldsCount++;
      } else {
        progressPerField.push({ name, progress: 0 });
      }
    });

    const overall = fieldsCount > 0 ? totalProgress / fieldsCount : 0;
    return { overall, progressPerField };
  };

  useEffect(() => {
    if(token){
      getUser();
      getVipRewards();
    }
  }, [token]);

  useEffect(() => {
    if (user?.userTierProgress?.[0] && user?.nextVipTier && data.length > 0) {
      const currentTier = data.find(
        (item) => item?.vipTierId === user?.currentVipTier?.vipTierId
      );

      if (currentTier) {
        const { overall, progressPerField } = calculateProgress(
          user.userTierProgress[0],
          user.nextVipTier
        );

        setFieldProgress(progressPerField);
        setOverallProgress(parseInt(overall));
      }
    }
  }, [user, data]);

  return { data, loading, user, overallProgress, fieldProgress, rightPanel };
};

export default useVip;
