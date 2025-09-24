'use client';
import { rewardPopers, spinLoader } from '@/assets/json';
import { cross, warningIcon, spinWheel } from '@/assets/svg';
import CountdownTimer from '@/common/components/custom-countdown-timer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Lottie from 'lottie-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import useSpinWheel from '../hooks/useSpinWheel';
// import Link from 'next/link'; // Import Link for navigation
import styles from './style.module.scss';

function SpinWheel({ handleClick, isOpen }) {
  const { pixiContainerRef, spinWheelResult, spinWheelData, user } =
    useSpinWheel({
      isOpen,
    });
  const [showTimer, setShowTimer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (spinWheelData) {
      setLoading(false);
    }
    if (spinWheelData?.isAvailable === false) {
      setShowTimer(true);
    }
  }, [spinWheelData]);

  const handleTimerExpire = React.useCallback(() => {
    setTimeout(() => setShowTimer(false), 0);
  }, []);

  const closeAndRedirect = () => {
    handleClick(); // Close the popup
    window.location.href = '/setting?active=email';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent className=" max-w-[100%] md:max-w-[80%] md:max-h-[60%] w-[550px] mx-auto mb-6 rounded-lg shadow-lg border-none">
        <DialogHeader className="flex">
          <div className="flex justify-between">
            <div className='flex flex-row gap-2 items-center '>
              <Image src={spinWheel} alt="store image" />
              <DialogTitle className={'text-[18px] text-white'}>
                Spin a Wheel
              </DialogTitle>
            </div>
            <Image
              src={cross}
              alt="close icon"
              onClick={handleClick}
              className="invert hover:bg-gray-500 rounded-xl"
            />
          </div>
        </DialogHeader>

        {loading && (
          <div className="text-center text-white">
            <p>Get ready to spin and win!</p>
            <div className="w-[170px] mx-auto">
              <Lottie animationData={spinLoader} />
            </div>
          </div>
        )}

        {!loading && showTimer && (
          <div className="min-h-[250px] flex flex-col justify-center items-center gap-2">
            <h4 className="text-sm text-white font-medium mx-auto mb-5 w-fit text-center">
              Your next spin is just a countdown away!
            </h4>
            <CountdownTimer
              durationInSeconds={Math.floor(
                spinWheelData?.timeRemainingForNextSpin / 1000
              )}
              onExpire={handleTimerExpire}
            />
          </div>
        )}

        {!loading && !showTimer && (
          <div className={`${styles.spinWheelWrap} flex-col`}>
            {!user?.email ? (
              <>
                <div className="h-[250px] flex flex-col justify-center items-center">
                  <div className="border rounded-[10px] border-orange-500 bg-[rgb(var(--lb-blue-900))] text-white text-center p-3 font-semibold">
                    <p className="text-2xl flex justify-center items-center">
                      <Image
                        src={warningIcon}
                        alt="warning icon"
                        className="mx-2"
                      />
                    </p>
                    <p>Please verify your email to spin the wheel.</p>
                    <p className="mt-2">
                      <a
                        onClick={closeAndRedirect} // Close the popup and redirect
                        className="text-blue-400 hover:text-blue-600 cursor-pointer"
                      >
                        Click here
                      </a>
                    </p>
                  </div>
                </div>
              </>
            ) : !spinWheelResult?.showResult ? (
              <div
                className={`${styles.spinWheelWrap}`}
                ref={pixiContainerRef}
                id="pixi-spin-wheel"
              ></div>
            ) : (
              <div className="congratulations-popover text-white px-2">
                <Lottie animationData={rewardPopers} />
                <div className={styles.congratulationsPopoverContent}>
                  <h3>You have won</h3>
                  <h3>
                    {spinWheelResult?.gc} GC & {spinWheelResult?.sc} SC
                  </h3>
                </div>
                <div className={styles.congratulationsPopoverContentSecond}>
                  <p className="text-white px-2">Wanna spin again?</p>
                  <p className="text-white px-4">
                    Close this window and re-open the spin wheel after 24 hours
                    to get another free spin!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SpinWheel;
