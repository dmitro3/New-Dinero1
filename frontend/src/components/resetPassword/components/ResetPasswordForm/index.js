import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useResetPassword from '../../hook/useResetPassword';
import Image from 'next/image';
import { eye, eyeOff } from '@/assets/svg';

const ResetPasswordForm = ({ newPasswordKey, onClose, setToastState }) => {
  const {
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
  } = useResetPassword(newPasswordKey, onClose, setToastState);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleResetPassword();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label
          htmlFor="new-password"
          className="text-lg font-medium text-gray-300 mb-2"
        >
          New Password
        </label>
        <div className="relative w-full">
          <Input
            id="new-password"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            className="p-3 text-white rounded-md border border-[rgb(var(--lb-blue-300))] focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            {showNewPassword ? (
              <Image src={eyeOff} alt="eye-off" />
            ) : (
              <Image src={eye} alt="eye" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="confirm-password"
          className="text-lg font-medium text-gray-300 mb-2"
        >
          Confirm Password
        </label>
        <div className="relative w-full">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
            className="p-3 text-white rounded-md border border-[rgb(var(--lb-blue-300))] focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
              <Image src={eyeOff} alt="eye-off" />
            ) : (
              <Image src={eye} alt="eye" />
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
