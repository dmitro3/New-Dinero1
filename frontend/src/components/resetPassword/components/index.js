'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ResetPasswordForm from './ResetPasswordForm';
import CustomToast from '@/common/components/custom-toaster';
import { key } from '@/assets/svg';
import Image from 'next/image';
import useAuthRedirect from '../hook/useAuthRedirect';
import { isEmpty } from '@/lib/utils';
import { getAccessToken } from '@/services/storageUtils';

const ResetPasswordModal = () => {
  useAuthRedirect();
  const searchParams = useSearchParams();
  const router = useRouter();

  const newPasswordKey = searchParams.get('newPasswordKey');
  const [open, setOpen] = useState(Boolean(newPasswordKey));

  const [toastState, setToastState] = useState({
    showToast: false,
    message: '',
    status: '',
  });

  const { showToast, message, status } = toastState;

  const handleClose = () => {
    setOpen(false);
    router.push('/');
  };

  useEffect(() => {
    setOpen(Boolean(newPasswordKey));
  }, [newPasswordKey]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) =>
          isOpen && !isEmpty(getAccessToken()) && setOpen(isOpen)
        }
        modal
      >
        <DialogContent className="p-8 w-full sm:w-[500px] border-none rounded-xl bg-[hsl(var(--background))] shadow-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold text-center flex items-center justify-center gap-4">
              <Image
                src={key}
                alt="Key Icon"
                width={28}
                height={28}
                style={{ filter: 'invert(1)' }}
              />
              Reset Password
            </DialogTitle>
          </DialogHeader>
          <ResetPasswordForm
            newPasswordKey={newPasswordKey}
            onClose={handleClose}
            setToastState={setToastState}
          />
        </DialogContent>
      </Dialog>
      <CustomToast
        showToast={showToast}
        setShowToast={(val) =>
          setToastState((prev) => ({ ...prev, showToast: val }))
        }
        message={message}
        status={status}
        duration={2000}
      />
    </>
  );
};

export default ResetPasswordModal;
