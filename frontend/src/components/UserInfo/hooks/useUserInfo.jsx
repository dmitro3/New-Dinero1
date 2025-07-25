import { useStateContext } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const useUserInfo = () => {
  const [isOpen, setIsOpen] = useState(true);
  // const [userData, setUserData] = useState([]);
  // const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const {
    state: { user,userLoading },
  } = useStateContext();
  const router = useRouter();
  const handleClose = () => {
    setIsOpen((prev) => !prev);
  };
  const handleClickEdit = () => {
    router.push('/setting?active=profile');
  };
  useEffect(() => {
    // setUserLoading(false);
    setUserError(null);
  }, []);

  return {
    isOpen,
    handleClose,
    userData: user,
    userLoading,
    userError,
    handleClickEdit,
  };
};

export default useUserInfo;
