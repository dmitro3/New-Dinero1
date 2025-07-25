'use client';
import { updatePassword } from '@/services/putReguest';
import { removeLoginToken } from '@/services/storageUtils';
// import { Router } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
const usePassword = () => {
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, watch, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updatePassword(data);
      setShowToast(true);
      setMessage('password updated successfully');
      setStatus('success');
      reset();

      // setTimeout(() => {
      //   removeLoginToken();
      //   Router.push('/setting');  
      // }, 2000); 
      
      removeLoginToken(); 
    } catch (error) {
      setShowToast(true);
      setMessage(error?.message || 'Something went wrong ');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };
  return {
    control,
    handleSubmit,
    onSubmit,
    watch,
    message,
    status,
    showToast,
    setShowToast,
    loading,
  };
};
export default usePassword;
