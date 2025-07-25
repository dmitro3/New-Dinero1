/* eslint-disable no-undef */
import { getAccessToken } from '@/services/storageUtils';
import { SOCKET_URLS } from '@/socket/config';
import { SOCKET_EVENTS } from '@/socket/events';
import useWebSocket from '@/socket/hooks/useWebSocket';
import { useState, useEffect } from 'react';
import { useStateContext } from '@/store';
import { GLOBAL_CHAT_ID } from '../constants';

const useChatModule = () => {
  const token = getAccessToken();
  const { state } = useStateContext();
  const [webSocketChat, setWebSocketChat] = useState();
  const [webSocketRainChat, setWebSocketRainChat] = useState();
  const [sidebarWidth, setSidebarWidth] = useState('22rem');

  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth(
        window.innerWidth >= 2400
          ? '32rem'
          : window.innerWidth >= 2200
            ? '30rem'
            : window.innerWidth >= 2000
              ? '28rem'
              : window.innerWidth >= 1800
                ? '26rem'
                : window.innerWidth >= 1600
                  ? '24rem'
                  : '22rem'
      );
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const socketEventArray = [
    {
      eventName: SOCKET_EVENTS.LIVE_USER_CHATS,
      handleData: (data) => {
        try {
          setWebSocketChat(data);
        } catch (err) {
          console.log('Error in handling socket event notification', err);
        }
      },
    },
    {
      eventName: SOCKET_EVENTS.LIVE_CHAT_RAIN,
      handleData: (data) => {
        try {
          setWebSocketRainChat(data);
        } catch (err) {
          console.log('Error in handling socket event notification', err);
        }
      },
    },
  ];
  const { sendMessage } = useWebSocket(
    token ? SOCKET_URLS.userChat : SOCKET_URLS.public,
    socketEventArray,
    token,
    { group: GLOBAL_CHAT_ID }
  );
  return { sendMessage, state, webSocketChat, webSocketRainChat, sidebarWidth };
};

export default useChatModule;
