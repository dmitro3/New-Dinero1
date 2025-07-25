import { getBonusService } from '@/services/getRequests';
import { claimYourBonus } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';

const useBonus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const {
    state: { user },
  } = useStateContext();
  const fetchBonus = async () => {
    setLoading(true);
    try {
      const response = await getBonusService();

      setData(response?.data?.bonus?.rows);
    } catch (error) {
      console.error('Failed to fetch bonus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonus();
  }, []);

  const onsubmit = async (id) => {
    const payload = { userId: user?.userId, bonusId: `${id}` };
    setSubmitLoading(true);
    try {
      await claimYourBonus(payload);
      setShowToast(true);
      setMessage('Bonus claimed successfully');
      setStatus('success');
    } catch (error) {
      setShowToast(true);
      setMessage(error?.message || 'something went wrong');
      setStatus('error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return {
    data,
    loading,
    onsubmit,
    showToast,
    message,
    status,
    setShowToast,
    submitLoading,
  };
};

export default useBonus;
