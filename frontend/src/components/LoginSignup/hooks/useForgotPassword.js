'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { forgotPassword } from '@/services/postRequest';

const useForgotPassword = ({ setIsForgotPassword, setToastState }) => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setError } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (value) => {
    setLoading(true);
    try {
      await forgotPassword(value);
      setLoading(false);
      setToastState({
        showToast: true,
        message: 'Password reset link sent to your email.',
        status: 'success',
      });
      setIsForgotPassword(false);
    } catch (error) {
      setLoading(false);
      setError('email', {
        type: 'manual',
        message:
          error.message || 'Failed to send reset link. Please try again.',
      });
    }
  };

  return { control, handleSubmit, onSubmit, loading };
};

export default useForgotPassword;
