import { updateSelfExclusion } from '@/services/putReguest';
import { removeLoginToken } from '@/services/storageUtils';

const { useState } = require('react');

const useResponsibleGambling = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedValue, setCheckedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const [loading, setLoading] = useState(false);
  const handleDate = (value) => {
    setSelectedDate(value);
  };
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleRadio = (value) => {
    setCheckedValue(value);
    if (value !== 'date') {
      setSelectedDate(null);
    }
  };

  const handleRequestSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const payload = {
      selfExclusion: selectedDate ? selectedDate : null,
      isSelfExclusionPermanent: checkedValue === 'permanent' ? true : false,
    };
    try {
      await updateSelfExclusion(payload);
      setMessage('Self exclusion set sucessfully');
      setShowToast(true);
      setStatus('success');
      removeLoginToken();
    } catch (error) {
      setMessage(error.message || 'Something went wrong!');
      setShowToast(true);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    handleClick,
    checkedValue,
    handleRadio,
    handleDate,
    selectedDate,
    handleRequestSubmit,
    loading,
    message,
    showToast,
    setShowToast,
    status,
  };
};
export default useResponsibleGambling;
