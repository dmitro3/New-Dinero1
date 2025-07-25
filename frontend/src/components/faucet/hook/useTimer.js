'use client';
import { useState, useEffect } from 'react';

const useTimer = (initialTime = 300000, setActive) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.floor(parseInt(initialTime) / 1000)
  );

  useEffect(() => {
    const newTime = Math.floor(parseInt(initialTime) / 1000);
    setTimeLeft(newTime);
  }, [initialTime]);

  useEffect(() => {
    if (timeLeft === 0 && setActive) {
      setActive(false);
    }
  }, [timeLeft, setActive]);
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
    };
  };

  return formatTime(timeLeft);
};

export default useTimer;
