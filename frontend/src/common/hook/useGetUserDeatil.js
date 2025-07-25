'use client';
import { getUserDetails } from '@/services/getRequests';
import { getAccessToken } from '@/services/storageUtils';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';

const useGetUserDeatil = () => {
  const [userData, setUserData] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const { dispatch } = useStateContext();
  const token = getAccessToken();

  const getUser = async (selectedCoin) => {
    // console.log(selectedCoin, 'coin');
    setUserLoading(true);
    dispatch({ type: 'SET_USER_LOADING', payload: userLoading });
    setUserError(null);

    const payload = {
      currencyCode: selectedCoin === 'gold' ? 'GC' : 'SC',
    };

    try {
      const response = await getUserDetails(payload);
      dispatch({ type: 'SET_USER', payload: response.data });
      setUserData(response.data);
    } catch (err) {
      setUserError(err.message);
      dispatch({ type: 'SET_USER_ERROR', payload: userError });
    } finally {
      setUserLoading(false);
      dispatch({ type: 'SET_USER_LOADING', payload: userLoading });
    }
  };

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  return {
    userData,
    userLoading,
    userError,
    getUser,
  };
};

export default useGetUserDeatil;
