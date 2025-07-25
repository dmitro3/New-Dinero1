import { getUserDetails } from '@/services/getRequests';
import { getAccessToken } from '@/services/storageUtils';
import { useEffect, useState } from 'react';

const useUserDetails = () => {
  const [userData, setUserData] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  const getUser = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const response = await getUserDetails();
      setUserData(response?.data);
    } catch (err) {
      setUserError(err.message);
    } finally {
      setUserLoading(false);
    }
  };
  useEffect(() => {
    if(getAccessToken())
    getUser();
  }, []);

  return {
    userData,
    userLoading,
    userError,
  };
};

export default useUserDetails;