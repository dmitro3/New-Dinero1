'use client';
import { useEffect, useState } from 'react';
import { cross, faucetIcon } from '@/assets/svg';
import CoinToggler from '@/components/Header/components/CoinToggler';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import useFaucet from '../hook/useFaucet';
import { Button } from '@/components/ui/button';
import CustomCircularloading from '@/common/components/custom-circular-loading';
import CustomToast from '@/common/components/custom-toaster';
import ReCAPTCHA from 'react-google-recaptcha';
import Timer from './timer';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Faucet = ({ isOpen, handleClick }) => {
  const {
    t,
    data,
    loading,
    handleSubmit,
    onSubmit,
    message,
    showToast,
    status,
    setShowToast,
    active,
    setActive,
    isFaucetClaimed,
    setCurrency,
    onChange,
    verified,
    error,
    getLoading,
    user,
    fetchFaucetData,
  } = useFaucet();
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    if (isFaucetClaimed) {
      setActive(false);
    }
  }, [isFaucetClaimed, setActive]);

  const handleClaim = async () => {
    const success = await onSubmit();
    if (success) {
      setActive(false);
      await fetchFaucetData();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClick} className="border-none">
      {/* <DialogContent className="max-w-lg max-h-[420px] mx-auto mb-6 rounded-lg bg-[hsl(var(--main-background))] shadow-lg border-none"> */}
      <DialogContent className="max-w-lg min-h-[420px] mx-auto mb-6 rounded-lg bg-[hsl(var(--main-background))] shadow-lg border-none">
        <DialogHeader className="flex flex-row justify-between max-h-8">
          <div className="flex justify-center items-center space-x-2">
            <Image src={faucetIcon} alt="store image" />
            <DialogTitle className="text-white">{t('Faucet')}</DialogTitle>
          </div>
          <div className="flex">
            <Image
              src={cross}
              alt="close icon"
              onClick={handleClick}
              className="invert hover:bg-gray-500 rounded-xl cursor-pointer"
            />
          </div>
        </DialogHeader>

        {getLoading ? (
          <CustomCircularloading />
        ) : (
          <>
            <div className="max-w-[304px] mx-auto">
              <CoinToggler setCurrency={setCurrency} isPopupRequired={false} />
            </div>
            <p className="text-red-500 text-center">{error}</p>
            {showHint && (
              <div className="relative w-[calc(100%+48px)] -mx-6 mt-2 bg-[rgb(var(--lb-blue-800))] rounded-lg text-white p-4 mb-4">
                <div className="font-bold mb-2">Hint</div>
                <ul className="text-sm list-decimal list-inside space-y-1">
                  <li>Multi-accounts using the faucet will be frozen</li>
                  <li>
                    The more active (share, purchase, chat), the more faucet
                  </li>
                </ul>
                <Button
                  onClick={() => setShowHint(false)}
                  className="absolute bottom-2 right-4 text-sm bg-green-500 text-black hover:bg-green-400 px-4 py-1"
                >
                  I got it
                </Button>
              </div>
            )}

            {active ? (
              <form
                onSubmit={handleSubmit(handleClaim)}
                className="flex flex-col justify-center gap-2"
              >
                {!error && (
                  <>
                    <div className="flex justify-center items-center w-full max-w-[200px] sm:max-w-md mx-auto">
                      <ReCAPTCHA
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        onChange={onChange}
                      />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          disabled={loading || !verified}
                          type="submit"
                          className="w-full max-w-[250px] sm:max-w-[304px] bg-green-400 mx-auto hover:bg-green-300 cursor-pointer text-black"
                        >
                          Claim
                        </Button>
                      </TooltipTrigger>
                      {!user?.email && (
                        <TooltipContent
                          side="top"
                          className="z-[99999] text-white font-semibold border shadow-lg rounded-md p-4 mx-auto flex justify-center items-center"
                        >
                          <p>Hey, verify your email first to claim faucet!</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </>
                )}
              </form>
            ) : (
              <Timer
                initialTime={data?.timeRemainingForNextFaucet}
                setActive={setActive}
              />
            )}

            <p className="text-[rgb(var(--lb-blue-200))] text-center">
              Multi-accounts using the faucet will be frozen
            </p>
            <CustomToast
              message={message}
              showToast={showToast}
              status={status}
              setShowToast={setShowToast}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Faucet;
