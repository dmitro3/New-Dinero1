import { getChatUserInfo } from '@/services/getRequests';
import { useState } from 'react';

const useWinnerCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [chatUserLoading, setChatUserLoading] = useState(true);
  let newUserId;
  const handleOpenUserInfo = (userId) => {
    setIsOpen(!isOpen);
    newUserId = userId;
    fetchUserDetails();
  };
  const fetchUserDetails = async () => {
    const payload = { newUserId, currencyCode: 'BSC' };
    setChatUserLoading(true);
    try {
      const response = await getChatUserInfo(payload);
      setUserData(response?.data?.data || []);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setChatUserLoading(false);
    }
  };
  return {
    handleOpenUserInfo,
    userData,
    isOpen,
    setIsOpen,
    chatUserLoading,
  };
};

export default useWinnerCard;
