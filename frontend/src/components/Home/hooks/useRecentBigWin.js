import { isEmpty } from '@/lib/utils';
import { getRecentBigWin } from '@/services/getRequests';
import { getAccessToken } from '@/services/storageUtils';
import { SOCKET_URLS } from '@/socket/config';
import { SOCKET_EVENTS } from '@/socket/events';
import useWebSocket from '@/socket/hooks/useWebSocket';
import { useEffect, useRef, useState } from 'react';

const useRecentBigWin = () => {
  const [data, setData] = useState([]);
  const [socketData, setSocketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(15);
  const [isOpen, setIsOpen] = useState(false);
  const [gameplayData, setGameplayData] = useState([]);
  const scrollRef = useRef();
  const token = getAccessToken();
  const handleOnClick = (data) => {
    setGameplayData(data);
    setIsOpen(!isOpen);
  };
  const socketEventArray = [
    {
      eventName: SOCKET_EVENTS.RECENT_BIG_WIN,
      handleData: (data) => {
        try {
          setSocketData(data?.data);
        } catch (err) {
          console.log('Error in handling socket event notification', err);
        }
      },
    },
  ];

  useWebSocket(
    token ? SOCKET_URLS.recentBigWin : SOCKET_URLS.public,
    socketEventArray,
    token
  );
  const fetchData = async () => {
    const payload = {
      pageNo: pageNo,
      limit: limit,
      // endDate: new Date().toISOString().split('T')[0],
    };
    try {
      setLoading(true);
      const response = await getRecentBigWin(payload);

      setData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 20;
    const scrollStep = 1;

    const scrollInterval = setInterval(
      () => {
        if (scrollContainer) {
          scrollAmount += scrollStep;
          if (scrollAmount >= scrollContainer.scrollWidth / 2) {
            scrollAmount = 0;
            scrollContainer.scrollLeft = 0;
          } else {
            scrollContainer.scrollLeft += scrollStep;
          }
        }
      },
      scrollSpeed,
      loading
    );

    return () => clearInterval(scrollInterval);
  }, []);
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [pageNo, limit, token]);
  const formatedData = !isEmpty(socketData) ? [...data, socketData] : data;

  return {
    formatedData,
    loading,
    error,
    pageNo,
    setPageNo,
    limit,
    setLimit,
    scrollRef,
    isOpen,
    setIsOpen,
    gameplayData,
    handleOnClick,
  };
};

export default useRecentBigWin;
