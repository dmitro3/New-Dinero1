import { verifyForgotPassword } from '@/services/postRequest';
import { useState } from 'react';

const useResetPassword = (newPasswordKey, onClose, setToastState) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  const handleResetPassword = async () => {
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const payload = {
      password,
      newPasswordKey,
    };

    setLoading(true);
    setError('');

    try {
      await verifyForgotPassword(payload);
      setToastState({
        showToast: true,
        message: 'Password reset successfully!',
        status: 'success',
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    handleResetPassword,
    showNewPassword,
    showConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,
  };
};

export default useResetPassword;
