import { Button } from '@/components/ui/button';
import useVerifyKyc from '../../hooks/useVerifyKyc';
import { identification, successIdentity } from '@/assets/png';
import Image from 'next/image';
import { KYC_STATUS } from '../../constant';
import { useEffect } from 'react';
import CustomToast from '@/common/components/custom-toaster';

const Verify = ({ setActiveTab }) => {
  const {
    handleVerifyKYC,
    veriffStatus,
    user,
    showToast,
    setToastState,
    message,
    status,
  } = useVerifyKyc();

  useEffect(() => {
    if (!user?.lastName || !user?.userDetails?.zip) {
      setActiveTab('profile');
      setToastState({
        showToast: true,
        message: 'Enter your personal details to verify !',
        status: 'error',
      });
    }
  }, [user, setActiveTab]);

  // if (!user?.firstName || !user?.lastName) {
  //   return null;
  // }
  return (
    <section>
      <div className="text-white text-[14px] font-bold">
        Your account status:{' '}
        <span
          className={`${[KYC_STATUS.approved, KYC_STATUS.requested].includes(veriffStatus) ? 'text-green-500' : 'text-red-500'} text-[14px] font-bold`}
        >
          {veriffStatus}
        </span>
      </div>
      {[KYC_STATUS.approved, KYC_STATUS.requested].includes(veriffStatus) ? (
        <div className="flex flex-col items-center justify-center p-5">
          <Image
            src={successIdentity}
            alt="successIdentification"
            width={150}
            height={150}
            className="my-4"
          />
          <p className="text-white text-[14px] font-bold text-center p-2">
            Your KYC verification has been successfully completed.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-5">
          <Image
            src={identification}
            alt="identification"
            width={150}
            height={150}
            className="my-4"
          />
          <p className="text-white text-[14px] font-bold text-center p-2">
            Complete your verification by clicking the button below.
          </p>
          <Button
            onClick={handleVerifyKYC}
            className="w-[85px] h-[40px] leading-[42px] cursor-pointer text-center text-white font-semibold rounded-[15px] border-2 border-[#EDCCFF] border-solid"
            style={{
              background:
                'radial-gradient(340.24% 340.24% at 44.29% 0%, #01623C 0%, #072561 38.71%, #062768 100%)',
              boxShadow:
                '5px 6px 11px 0px hsla(0, 0%, 100%, 0.25) inset, 0px -1px 9px 0px hsla(0, 0%, 100%, 0.1)',
            }}
          >
            Click here
          </Button>
        </div>
      )}
      <CustomToast
        showToast={showToast}
        setShowToast={(val) =>
          setToastState((prev) => ({ ...prev, showToast: val }))
        }
        message={message}
        status={status}
        duration={2000}
      />
    </section>

  );
};
export default Verify;