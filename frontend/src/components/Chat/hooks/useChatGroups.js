import { getChatGroup } from '@/services/getRequests';
import { joinChatGroup } from '@/services/postRequest';
import { useEffect, useState } from 'react';

const useChatGroups = () => {
  const [chatGroupData, setChatGroupData] = useState([]);

  const handleJoin = async (id) => {
    const payload = { chatGroupId: parseInt(id) };
    try {
      await joinChatGroup(payload);
    } catch (error) {
      console.log(error?.message);
    }
  };
  const fetchGroupChat = async () => {
    try {
      const response = await getChatGroup();
      console.log(response);

      setChatGroupData(response);
    } catch (error) {
      console.log(error?.message);
    }
  };
  useEffect(() => {
    fetchGroupChat();
  }, []);
  return { chatGroupData, handleJoin };
};
export default useChatGroups;
