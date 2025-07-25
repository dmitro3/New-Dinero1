import { useState } from 'react';
import { TipCurrencyList } from '../constants';
import { useTranslation } from 'react-i18next';
import { createTip } from '@/services/postRequest';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { useStateContext } from '@/store';

const useTip = ({ handleCloseDialog }) => {
  const {
    state: { user },
  } = useStateContext();
  const { control, handleSubmit, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      tipUsername: '',
      tipAmount: '',
      currencyCode: '',
      isPublic: false,
    },
  });
  const { t } = useTranslation();
  const tipCurrencyList = TipCurrencyList;
  const [currency, setCurrency] = useState(tipCurrencyList[1]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const handleSelect = (item) => {
    setCurrency(item);
  };
  const onSubmit = async (data) => {
    if (balance <= 20) {
      setShowToast(true);
      setMessage('Your balance must be greater than 20 to create a tip.');
      setStatus('error');
      return;
    }
    const payload = {
      tipUsername: data?.tipUsername,
      tipAmount: parseInt(data?.tipAmount),
      currencyCode: currency?.value,
      isPublic: checked,
    };

    setLoading(true);
    try {
      await createTip(payload);
      reset();
      toast({
        title: 'Success!',
        description: 'Tip send suceesfully',
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
  const balance =
    currency?.value === 'GC'
      ? user.userWallet.find((item) => item.currencyCode === 'GC')?.balance || 0
      : user.userWallet
          .filter((item) => item.currencyCode !== 'GC') 
          .reduce((acc, item) => acc + parseFloat(item.balance), 0);

  return {
    t,
    tipCurrencyList,
    currency,
    handleSelect,
    checked,
    setChecked,
    onSubmit,
    handleSubmit,
    control,
    loading,
    showToast,
    message,
    status,
    setShowToast,
    balance,
  };
};
export default useTip;
