import { getGroupChat } from '@/services/getRequests';
import { claimChatRain } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { GLOBAL_CHAT_ID } from '../constants';
import { toast } from '@/hooks/use-toast';
const useGroupChats = ({ webSocketChat }) => {
  const [groupChatsData, setGroupChatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState('');
  const {
    state: { user },
  } = useStateContext();

  
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const addLocalMessage = (message) => {
    setGroupChatsData((prev) => {
      // Prevent duplicate local messages by checking messageId
      const exists = prev.some((chat) => chat.messageId === message.messageId);
      if (exists) {
        return prev;
      }
      // Use existing message.messageId (tempMessageId) if present, else generate unique id
      const messageId = message.messageId || `local-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      return [
        ...prev,
        {
          ...message,
          messageId: messageId,
          createdAt: new Date().toISOString(),
          user: user,
        },
      ];
    });
  };






  const handleClick = async (chatRainId) => {
    try {
      await claimChatRain({
        chatRainId: parseInt(chatRainId),
        groupId: GLOBAL_CHAT_ID,
      });
      setGroupChatsData((prevChats) =>
        prevChats.map((chat) =>
          chat.ChatRain && parseInt(chat.ChatRain.id) === parseInt(chatRainId)
            ? {
              ...chat,
              ChatRain: {
                ...chat.ChatRain,
                isUserClaimed: true,
              },
            }
            : chat
        )
      );
      toast({
        title: 'Success!',
        description: 'Claimed successfully',
        className:
          'fixed top-4 right-4 z-50 w-[55%] sm:w-[45%] md:w-[30%] text-black font-semibold border shadow-lg rounded-md p-4 bg-green-400 border-green-50',
      });
    } catch (error) {
      toast({
        title: 'Error!',
        description: 'Already Chat Rain Claimed',
        className:
          'fixed top-4 right-4 z-50 w-[55%] sm:w-[45%] md:w-[30%] text-black font-semibold border shadow-lg rounded-md p-4 bg-red-400 border-red-50',
      });
      setError(error?.message);
    }
  };

  const formatTime = (dateTime) => {
    if (dateTime) {
      const date = new Date(dateTime);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(date);
    }
  };

  const fetchGroupChat = async () => {
    setLoading(true);
    try {
      const response = await getGroupChat({
        chatGroupId: GLOBAL_CHAT_ID,
        limit: 200,
        pageNo: 1,
      });
      setGroupChatsData(response?.data?.data || []);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (user?.userId) fetchGroupChat();
  }, [user?.userId]);

  
  useEffect(() => {
    if (webSocketChat?.data) {
      const messageType = webSocketChat?.data?.messageType;
      const { ChatRain, isClosed, tempMessageId } = webSocketChat.data;

      if (
        messageType === 'MESSAGE' ||
        messageType === 'GIF' ||
        messageType === 'TIP'
      ) {
        // Prevent duplicate messages by checking messageId or tempMessageId
        setGroupChatsData((prevChats) => {
          // If tempMessageId exists, replace local message with same tempMessageId
          if (tempMessageId) {
            const index = prevChats.findIndex(
              (chat) => chat.messageId === tempMessageId
            );
            if (index !== -1) {
              const newChats = [...prevChats];
              newChats[index] = webSocketChat.data;
              return newChats;
            }
          }
          // Otherwise, check by messageId
          const exists = prevChats.some(
            (chat) => chat.messageId === webSocketChat.data.messageId
          );
          if (exists) {
            return prevChats;
          }
          return [...prevChats, webSocketChat.data];
        });
      } else {
        setGroupChatsData((prevChats) => {
          let isUpdated = false;

          const updatedChats = prevChats.map((item) => {
            if (
              item.ChatRain &&
              parseInt(item.ChatRain.id) === parseInt(ChatRain?.id)
            ) {
              isUpdated = true;
              return {
                ...item,
                ChatRain: {
                  ...item.ChatRain,
                  isClosed,
                },
              };
            }
            return item;
          });
          if (!isUpdated) {
            return [...updatedChats, webSocketChat.data];
          }

          return updatedChats;
        });
      }
    }
  }, [webSocketChat]);


  useEffect(() => {
    scrollToBottom();
  }, [groupChatsData]);

  
  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [loading]);

  
  useEffect(() => {
    const handleLocalMessage = (e) => addLocalMessage(e.detail);
    window.addEventListener('new-local-message', handleLocalMessage);
    return () =>
      window.removeEventListener('new-local-message', handleLocalMessage);
  }, []);

  return {
    groupChatsData,
    formatTime,
    messagesEndRef,
    loading,
    handleClick,
    error,
    userIdForDisable: user?.userId,
  };
};

export default useGroupChats;
