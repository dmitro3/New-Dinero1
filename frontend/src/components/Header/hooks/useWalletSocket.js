import { useEffect } from 'react';
import { useStateContext } from '@/store';
import useWebSocket from '@/socket/hooks/useWebSocket';
import { SOCKET_EVENTS } from '@/socket/events';
import { SOCKET_URLS } from '@/socket/config';

const useWalletSocket = (token) => {
  const { dispatch } = useStateContext();

  const walletEventArray = [
    {
      eventName: SOCKET_EVENTS.WALLET_BALANCE,
      handleData: (data) => {
        if (data && data.data) {
          dispatch({
            type: 'UPDATE_SOCKET_WALLET',
            payload: {
              currencyCode: data.data.currencyCode,
              balance: data.data.balance,
            },
          });
        }
      },
    },
  ];

  const { isConnected } = useWebSocket(SOCKET_URLS.wallet, walletEventArray, token);

  useEffect(() => {
    // Optionally handle connection status or errors here
  }, [isConnected]);

  return { isConnected };
};

export default useWalletSocket;
