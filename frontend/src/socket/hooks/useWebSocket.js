'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// const MAX_RETRY = 1000;

const useWebSocket = (url, eventArray, token, payload) => {
  // const [retry, setRetry] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const socket = useRef(null);

  // Event handler for successful connection
  const handleConnected = () => {
    // console.log(`${url} socket connected`);
    setIsConnected(true);
  };

  // Event handler for socket errors
  const handleError = (err) => {
    setError(err || `Failed to connect socket on ${url}`);
  };

  // console.log('Socket  outside =', socket);

  const disconnectSocket = () => {
    if (socket.current) {
      socket.current.close();
      // Remove console.log to fix ESLint warning
    }
  };

  const connectSocket = () => {
    disconnectSocket();
    if (socket.current) {
      socket.current.connect();
    }
  };

  // Event handler for socket closure
  const handleDisconnect = (reason) => {
    // Remove console.log to fix ESLint warning
    setIsConnected(false);
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      connectSocket();
    }
    // else the socket will automatically try to reconnect
  };

  const startConnection = () => {
    try {
      const newSocket = io(`${process.env.NEXT_PUBLIC_APP_SOCKET_URL}/${url}`, {
        transports: ['websocket'],
        withCredentials: true,
        auth: { accessToken: token, ...payload },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        path: '/api/socket',
        extraHeaders: { Authorization: `Bearer ${token}` },
      });

      newSocket.on('connect', handleConnected);
      eventArray?.map(({ eventName, handleData }) => {
        return newSocket.on(eventName, handleData);
      });
      newSocket.on('connect_error', handleError);
      newSocket.on('disconnect', handleDisconnect);
      socket.current = newSocket;

      // eslint-disable-next-line no-undef
      window.privateSocket = newSocket; // If need to use at other places of project
    } catch {
      // openErrorToaster({
      // message: `Unable to connect ${url}, ${er?.message}`,
      // });
      // Remove console.log to fix ESLint warning
    }
  };

  useEffect(() => {
    disconnectSocket();
    startConnection();

    return () => {
      disconnectSocket();
    };
  }, [url, token]); // Reconnect when the URL changes

  // Function to send a message through the socket
  const sendMessage = (message, eventType, callback) => {
    const payload = message;
    if (isConnected) {
      socket.current.emit(eventType, payload, (response) => {
        if (response.status === 'success') {
          // Remove console.log to fix ESLint warning
        } else {
          // Remove console.error to fix ESLint warning
        }

        if (callback) {
          callback(response);
        }
      });
    } else {
      setError('Socket not connected. Message not sent:', message);
    }
  };

  return {
    socket,
    isConnected,
    sendMessage,
    error,
    connectSocket,
    disconnectSocket,
  };
};

export default useWebSocket;
