'use client';

import Image from 'next/image';

import { copy } from '@/assets/svg';
import CustomToast from '@/common/components/custom-toaster';
import useStart from '../../hook/useStart';

const Start = () => {
  const {
    // handleClick,
    handleCopy,
    message,
    refLink,
    setToastState,
    showToast,
    status,
  } = useStart();

  return (
    <section className="border border-[rgb(var(--lb-blue-300))] rounded">
      <div className="p-4 border-b border-[rgb(var(--lb-blue-300))]">
        <div className="mb-2">
          <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">
            Orion stars offers state-of-the-art affiliate system. You will
            forever receive commission from every user you refer. You can derive
            your commission using the following formula:
          </div>
        </div>
        <div className="mb-2">
          <div className="text-[rgb(var(--lb-blue-250))] text-[14px] font-bold mb-2">
            The formula:
          </div>
          <span className="p-2 rounded inline-block w-full text-white text-[13px] font-semibold bg-[hsl(var(--side-bar-card))] max-w-[400px]">
            SC wagered * 1% * commission rate
          </span>
        </div>
        <div className="mb-2">
          <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">
            Commission rate depends on your affiliate level, starting from 25%.
          </div>
        </div>
        <div className="mb-2">
          <div className="text-[rgb(var(--lb-blue-250))] text-[14px] font-bold mb-2">
            Referral Link
          </div>
          <div className="flex justify-between items-center p-2 rounded w-full text-white text-[13px] font-semibold bg-[hsl(var(--side-bar-card))] max-w-[400px]">
            <span>{refLink}</span>
            {/* Copy to clipboard here */}
            <span className="cursor-pointer" onClick={handleCopy}>
              <Image
                src={copy}
                alt="coin icon"
                className="w-4 h-4 mr-1"
                style={{ filter: 'invert(1)' }}
              />
            </span>
          </div>
        </div>
      </div>
      {/* <div className="mt-0 p-4 flex justify-between">
        <Button
          onClick={handleClick}
          className="bg-green-500 py-2 text-white rounded hover:bg-green-600 ml-auto mr-2"
        >
          Download Banners
        </Button>
      </div> */}
      <CustomToast
        showToast={showToast}
        setShowToast={(val) =>
          setToastState((prev) => ({ ...prev, showToast: val }))
        }
        message={message}
        status={status}
      />
    </section>
  );
};
export default Start;
