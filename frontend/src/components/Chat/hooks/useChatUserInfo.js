import { getChatUserInfo } from '@/services/getRequests';
import { useState } from 'react';

const useChatUserInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatUserData, setChatUserData] = useState([]);
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
      setChatUserData(response?.data?.data);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setChatUserLoading(false);
    }
  };
  return { handleOpenUserInfo, chatUserData, isOpen, setIsOpen, chatUserLoading };
};

export default useChatUserInfo;
