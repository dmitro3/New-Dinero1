import { createTicket } from '@/services/postRequest';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const useCreateTicket = ({ handleClick }) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const { control, handleSubmit, reset } = useForm({
    mode: 'onBlur',
  });
  const { t } = useTranslation();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await createTicket(formData);
      setMessage('ticket created suceesfully');
      setStatus('success');
      setShowToast(true);
      reset();
      handleClick();
    } catch (apiError) {
      setMessage(apiError.message || 'Something went wrong!');
      setStatus('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    loading,
    status,
    message,
    showToast,
    setShowToast,
    control,
    handleSubmit,
    t,
  };
};

export default useCreateTicket;
