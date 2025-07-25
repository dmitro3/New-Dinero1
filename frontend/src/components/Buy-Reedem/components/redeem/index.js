'use client';

import { useState } from 'react';
import Redeem from './redeembutton';
import { Button } from '@/components/ui/button';
import FiatCrypto from './fiatButton';
import { warningIcon } from '@/assets/svg';
import useReedem from '../../hooks/useReedem';
import Image from 'next/image';

export default function RedeemMain({ handleCloseDialog }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    t,
    router,
    isEmailVerified,
  } = useReedem();

  return (
    <>
      {!isEmailVerified && (
        <div className="border border-red-500 bg-[rgb(var(--lb-blue-900))] text-white text-center p-3 m-3 font-semibold">
          <p className="text-2xl flex justify-center items-center">
            <Image src={warningIcon} alt="warning icon" className="mx-2" />
            {t('warning')}:
          </p>
          <p className="my-2" >
            {t('redeemAfter')}&nbsp;
            <span
              className="underline cursor-pointer"
              onClick={() => {
                router.push('/setting?active=email');
                handleCloseDialog();
              }}
            >
              {t('settingEmail')}.
            </span>
          </p>
        </div>
      )}

      {
        isEmailVerified && (  
          <div className="w-full my-3 flex justify-center">
            <Button
              className="m-[10px] p-[10px] min-w-[30%] bg-blue-900 hover:bg-green-600 focus:bg-green-700"
              onClick={() => setSelectedOption('fiat')}
            >
              Fiat
            </Button>
            <Button
              className="m-[10px] p-[10px] min-w-[30%] bg-blue-900 hover:bg-green-600 focus:bg-green-700"
              onClick={() => setSelectedOption('crypto')}
            >
              Select Crypto
            </Button>
          </div>
      )}

      {isEmailVerified && selectedOption === 'fiat' && (
        <FiatCrypto handleCloseDialog={handleCloseDialog} />
      )}
      {isEmailVerified && selectedOption === 'crypto' && (
        <Redeem handleCloseDialog={handleCloseDialog} />
      )}
    </>
  );
}
