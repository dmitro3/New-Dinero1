'use client';
import { removeLoginToken } from '@/services/storageUtils';
import { useStateContext } from '@/store';
import { useRouter } from 'next/navigation';
const useLogout = ({ handleClick }) => {
  const router = useRouter();
  const {
    state: { user },
  } = useStateContext();
  const onClickLogout = async () => {
    await router.push('/');
    removeLoginToken();
    handleClick();
  };

  return { onClickLogout, userName: user?.username };
};
export default useLogout;
