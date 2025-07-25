import { useEffect, useState } from 'react';
import { getAllReferredUsers } from '@/services/getRequests';
import { useStateContext } from '@/store';
import { SORT_OPTIONS } from '../constant';

const useAffiliate = () => {
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [activeTab, setActiveTab] = useState(SORT_OPTIONS[0].value);

  const {
    state: { user },
  } = useStateContext();
  const userId = user?.userId;

  const fetchReferredUsers = async () => {
    setLoading(true);
    setError(null);
    // sortDirection = ['ASC', 'DESC'];
    const payload = { limit, pageNo, sortBy: activeTab, sortDirection: 'DESC' };
    try {
      const response = await getAllReferredUsers(payload);

      setReferredUsers(response?.data?.referredUsers || []);
      setTotalCount(response?.data?.referredUsers.count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formateDate = (timestamp) => {
    const date = new Date(timestamp);

    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const finalDate = formattedDate
      .replace(',', '')
      .replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3/$1/$2');
    return finalDate;
  };

  const refUsers = referredUsers.rows?.map((affiliation) => ({
    userId: affiliation.referredUser.userId,
    username: affiliation.referredUser.username,
    earnedCommission: affiliation.earnedCommission,
    wageredAmount: affiliation.wageredAmount,
    joinedAt: formateDate(affiliation.createdAt),
  }));

  useEffect(() => {
    if (userId) {
      fetchReferredUsers();
    }
  }, [limit, pageNo, activeTab]);

  return {
    refUsers,
    totalCount,
    loading,
    error,
    activeTab,
    setActiveTab,
    setLimit,
    setPageNo,
  };
};

export default useAffiliate;
