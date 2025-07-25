import { createChatRain } from '@/services/postRequest';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RainCurrencyList } from '../constants';
import { toast } from '@/hooks/use-toast';

const useRain = ({ handleCloseDialog }) => {
  const { control, handleSubmit, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      message: '',
      currencyCode: '',
      rainAmount: '',
      playerNumber: '',
    },
  });
  const { t } = useTranslation();
  const rainCurrencyList = RainCurrencyList;
  const [currency, setCurrency] = useState(rainCurrencyList[1]);
  const [playerType, setPlayerType] = useState('All');
  const [msg, setMsg] = useState('Good luck everyone!');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const handleSelect = (item) => {
    setCurrency(item);
  };
  const onSubmit = async (data) => {
    const payload = {
      message: data.message,
      currencyCode: currency?.value,
      rainAmount: parseInt(data.rainAmount),
      playerCount: parseInt(data.playerNumber),
    };

    setLoading(true);
    try {
      await createChatRain(payload);
      reset();
      toast({
        title: 'Success!',
        description:'chat rain created suceesfully',
        className:
          'fixed top-4 right-4 z-50 w-[55%] sm:w-[45%] md:w-[30%] text-black font-semibold border shadow-lg rounded-md p-4 bg-green-400 border-green-50',
      });
      handleCloseDialog();

    } catch (error) {
      setMessage(error.message || 'Something went wrong!');
      setStatus('error');
      setShowToast(true);
    } finally {
      setLoading(false);
      
    }
  };

  return {
    t,
    rainCurrencyList,
    setCurrency,
    setPlayerType,
    setMsg,
    currency,
    playerType,
    msg,
    handleSelect,
    control,
    handleSubmit,
    onSubmit,
    loading,
    message,
    status,
    showToast,
    setShowToast,
  };
};

export default useRain;
