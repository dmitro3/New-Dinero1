import { claimBonusDrop } from '@/services/postRequest';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const useBonusDrop = () => {
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm({
    mode: 'onBlur',
    defaultValues: {
      bonusDrop: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await claimBonusDrop(data);
      setMessage('Bonus drop send sucessfully');
      setShowToast(true);
      setStatus('success');
    } catch (error) {
      setMessage(error?.message || 'Somthing went wrong');
      setShowToast(true);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };
  return {
    showToast,
    setShowToast,
    message,
    status,
    loading,
    onSubmit,
    control,
    handleSubmit,
  };
};

export default useBonusDrop;
