import { getTicketsMessage } from '@/services/getRequests';
import { createTicketMessage } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const useTicketMessage = ({ ticketId }) => {
  const [ticketMessageData, setTicketMessageData] = useState([]);
  const [createMessageData, setCreateMessageData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [toastStatus, setToastStatus] = useState('success');
  const {
    state: { user },
  } = useStateContext();
  const { control, handleSubmit, reset } = useForm({
    mode: 'onBlur',
    defaultValues: { message: '' },
  });
  const { t } = useTranslation();
  const fetchTickets = async () => {
    setDataLoading(true);
    try {
      const response = await getTicketsMessage({ ticketId: ticketId });
      setTicketMessageData(response?.data?.mainTicket);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, [createMessageData]);

  const onSubmit = async (formData) => {
    const message = formData?.message;
    const payload = { ticketId, message };
    setDataLoading(true);
    try {
      const response = await createTicketMessage(payload);
      setCreateMessageData(response);
      reset();
      setMessage('ticket message created suceesfully');
      setToastStatus('success');
      setShowToast(true);
    } catch (apiError) {
      setMessage(apiError.message || 'Something went wrong!');
      setToastStatus('error');
      setShowToast(true);
    } finally {
      setDataLoading(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }

    const formattedDate = date.toISOString().split('T')[0];

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  };

  return {
    ticketMessageData,
    user,
    formatDate,
    control,
    handleSubmit,
    onSubmit,
    dataLoading,
    toastStatus,
    message,
    showToast,
    setShowToast,
    t,
  };
};

export default useTicketMessage;
