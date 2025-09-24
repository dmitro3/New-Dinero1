'use client';
import useGetUserDeatil from '@/common/hook/useGetUserDeatil';
import { getOtp } from '@/services/getRequests';
import { verifyOtp } from '@/services/putReguest';
import { useStateContext } from '@/store';
import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
const useEmail = () => {
  const { control, handleSubmit } = useForm({
    mode: 'onBlur',
  });
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const {
    state: { user },
  } = useStateContext();
  const { getUser } = useGetUserDeatil();
  const handleSetEmail = () => {
    const mail = user?.email;
    if (mail) {
      setEmail(mail);
      setEmailVerified(true);
    }
  };
  useEffect(() => {
    handleSetEmail();
  }, [user]);

  const startTimer = useCallback(() => {
    setIsTimerActive(true);
    setTimer(300);
  }, []);

  useEffect(() => {
    if (isTimerActive) {
      if (timer > 0) {
        const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
        return () => clearTimeout(countdown);
      } else {
        setEmailSubmitted(false);
        setIsTimerActive(false);
        setShowToast(true);
        setMessage('Time expired. Please request a new OTP.');
        setStatus('error');
      }
    }
  }, [timer, isTimerActive]);

  const handleEmailSubmit = (data) => {
    onEmailSubmit(data);
  };
  const onEmailSubmit = async (data) => {
    setIsEmailLoading(true);
    try {
      const response = await getOtp(data);
      setEmailSubmitted(true);
      startTimer();
      setShowToast(true);
      setMessage(response?.message || 'Otp send to your email');
      setStatus('success');
    } catch (error) {
      setShowToast(true);
      setMessage(error?.message);
      setStatus('error');
    } finally {
      setIsEmailLoading(false);
    }
  };
  const onOtpSubmit = async (data) => {
    setIsOtpLoading(true);
    try {
      const response = await verifyOtp(data);
      setEmailVerified(true);
      setShowToast(true);
      setMessage(response?.message || 'Email verified successfully');
      setStatus('success');
      setIsTimerActive(false);
      setTimer(60);
      getUser();
    } catch (error) {
      setShowToast(true);
      setMessage(error?.message);
      setStatus('error');
    } finally {
      setIsOtpLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    onEmailSubmit,
    onOtpSubmit,
    emailSubmitted,
    handleEmailSubmit,
    emailVerified,
    showToast,
    message,
    status,
    setShowToast,
    isOtpLoading,
    isEmailLoading,
    email,
    timer,
    isTimerActive,
    startTimer,
  };
};
export default useEmail;
