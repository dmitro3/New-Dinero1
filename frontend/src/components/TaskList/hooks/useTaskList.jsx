import useVip from '@/components/vip-page/hooks/useVip';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';
import { labelMapping } from '../constants';
import { isEmpty } from '@/lib/utils';

function useTaskList() {
  const [activeTaskList, setActiveTaskList] = useState([]);
  const [completedTaskList, setCompletedTaskList] = useState([]);
  const [cashBonus, setCashBonus] = useState();
  const [freeSpin, setFreeSpin] = useState();
  const { fieldProgress, loading } = useVip();

  const {
    state: { user, userLoading },
  } = useStateContext();

  function getRemainingDays(createdAt, timeBasedConsistency) {
    const created = isEmpty(createdAt) ? new Date() : createdAt;
    const createdDate = new Date(created);
    const deadline = new Date(createdDate);
    deadline.setDate(deadline.getDate() + timeBasedConsistency);

    const today = new Date();
    const remainingTime = deadline - today;

    const remainingDays = Math.max(
      Math.ceil(remainingTime / (1000 * 60 * 60 * 24)),
      0
    );
    return remainingDays;
  }

  const generateActiveData = () => {
    const activeTasks = [];
    const completedTasks = [];
    const remainigDays = getRemainingDays(
      user?.userTierProgress[0]?.createdAt,
      user?.nextVipTier?.timeBasedConsistency
    );
    fieldProgress.forEach((task, index) => {
      const userTaskValue = user?.nextVipTier?.[task.value] || 0;
      const formattedTask = {
        id: index,
        label: task.name,
        progress: task.progress,
        required: userTaskValue,
        task:
          labelMapping[task.value]?.generateTask(userTaskValue) ||
          userTaskValue,
        remainingDays: remainigDays,
      };

      if (task.progress < 100) {
        activeTasks.push(formattedTask);
      } else {
        completedTasks.push(formattedTask);
      }
    });

    setActiveTaskList(activeTasks);
    setCompletedTaskList(completedTasks);

    const rewards = user?.nextVipTier?.rewards?.[0];
    if (rewards) {
      setCashBonus(rewards.cashBonus);
      setFreeSpin(rewards.freeSpin);
    }
  };

  useEffect(() => {
    if (user?.nextVipTier && fieldProgress?.length > 0) {
      generateActiveData();
    }
  }, [user, fieldProgress]);

  return {
    userLoading,
    loading,
    activeTaskList,
    completedTaskList,
    cashBonus,
    freeSpin,
    user,
  };
}

export default useTaskList;
