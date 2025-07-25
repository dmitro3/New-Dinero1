'use client';
import { getTickets } from '@/services/getRequests';
import { getAccessToken } from '@/services/storageUtils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useTicket = () => {
  const [createTicket, setCreateTicket] = useState(false);
  const [isTicketMessageOpen, setIsTicketMessageOpen] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [ticketData, setTicketData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const token = getAccessToken();

  const handleClick = () => {
    setCreateTicket((prev) => !prev);
  };
  const handleTicketMessage = (id) => {
    if (id) {
      setIsTicketMessageOpen(true);
      setTicketId(id);
    } else {
      setIsTicketMessageOpen(false);
      setTicketId(null);
    }
  };
  const handleClose = () => {
    router.push('/');
  };
  const fetchTickets = async () => {
    setDataLoading(true);
    try {
      const response = await getTickets();
      setTicketData(response?.data?.tickets?.rows);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    if (token) fetchTickets();
  }, [createTicket]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
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
    createTicket,
    handleClick,
    handleClose,
    ticketData,
    dataLoading,
    formatDate,
    isTicketMessageOpen,
    handleTicketMessage,
    ticketId,
    setTicketId,
    t,
  };
};

export default useTicket;
