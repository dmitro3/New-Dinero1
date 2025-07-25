import useGetUserDeatil from '@/common/hook/useGetUserDeatil';
import { updateUser } from '@/services/putReguest';
import { useStateContext } from '@/store';
import { useState } from 'react';

const useAvatar = () => {
  const [file, setFile] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const { getUser } = useGetUserDeatil();
  const {
    state: { user },
  } = useStateContext();
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = { profileImage: file };
    setLoading(true);
    try {
      await updateUser(payload);
      setMessage('Avatar Updated Successfully');
      setShowToast(true);
      setStatus('success');
      getUser();
    } catch (apiError) {
      setMessage(apiError.message || 'Something went wrong!');
      setShowToast(true);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    setFile,
    user,
    showToast,
    setShowToast,
    message,
    status,
    loading,
    sizeError,
    setSizeError,
    file,
  };
};

export default useAvatar;
