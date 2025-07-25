'use client';

import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const CustomToast = ({
  showToast,
  setShowToast,
  message,
  status,
  duration = 3000,
  className = '',
}) => {
  const { toast } = useToast();
  const isSuccess = status === 'success';
  useEffect(() => {
    if (showToast) {
      toast({
        title: status === 'success' ? 'Success!' : 'Error!',
        description:
          message ||
          (status === 'success'
            ? 'Operation completed successfully.'
            : 'Something went wrong.'),
        onClose: () => setShowToast(false),
        className: `fixed top-4 right-4 z-50 w-[55%] sm:w-[45%] md:w-[30%] text-black font-semibold border shadow-lg rounded-md p-4 ${
          isSuccess
            ? 'bg-green-400 border-green-500'
            : 'bg-red-400 border-red-500'
        } ${className}`,
      });
      const timeout = setTimeout(() => {
        setShowToast(false);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [showToast, message, status, toast, setShowToast, duration]);
};

export default CustomToast;
