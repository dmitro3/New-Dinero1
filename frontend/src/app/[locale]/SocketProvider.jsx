'use client';

import { getAccessToken } from '@/services/storageUtils';
// import { setSocketWalletUpdate } from '@/redux/slices/auth.slice';
// import { updateSocketNotification } from '@/redux/slices/notification.slice';
import { SOCKET_URLS } from '@/socket/config';
import { SOCKET_EVENTS } from '@/socket/events';
import useWebSocket from '@/socket/hooks/useWebSocket';
import { useStateContext } from '@/store';

export default function SocketProvider({ children }) {
  const token = getAccessToken();
  const { dispatch } = useStateContext();

  const socketEventArray = [
    {
      eventName: SOCKET_EVENTS.WALLET_BALANCE,
      handleData: (data) => {
        try {
          dispatch({ type: 'UPDATE_SOCKET_WALLET', payload: data?.data });
        } catch (err) {
          console.log('Error in handling socket event wallet', err);
        }
      },
    },
    // {
    //   eventName: SOCKET_EVENTS.NOTIFICATION,
    //   handleData: (data) => {
    //     try {
    //       console.log('TCL: SocketProvider -> data', data);
    //     } catch (err) {
    //       console.log('Error in handling socket event notification',err);
    //     }
    //   },
    // },
  ];

  useWebSocket(
    token ? SOCKET_URLS.wallet : SOCKET_URLS.public,
    socketEventArray,
    token
  );

  return <div>{children}</div>;
}
