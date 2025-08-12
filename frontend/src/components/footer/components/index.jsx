'use client';
import React from 'react';
import CmsLink from './cms-link';
// import MediaPromotion from './media-promotion';
// import GlobalPromotion from './global-promotion/inedx';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { installButton, poweredByImg } from '@/assets/svg';
import useFooter from '../hooks/useFooter';
import Faucet from '@/components/faucet/components';

const Footer = () => {
  const { isGamePlay, t, handleClick, isOpen, handleOpenTerms } = useFooter();
  return (
    <>
      {!isGamePlay && <CmsLink />}
      {/* <MediaPromotion /> */}
      {/* <GlobalPromotion /> */}
      {!isGamePlay && (
        <>
          <div className="container mx-auto px- mt-4 text-gray-300 text-sm text-center border-t border-neutral-600">
            <p className="p-2">
              {t('sweepstakesNotice')}&nbsp;
              <span
                className="text-white underline cursor-pointer font-semibold"
                onClick={() => {
                  handleClick();
                }}
              >
                {t('clickHere')}
              </span>
              &nbsp;
              {t('alternateMethod')}
            </p>
          </div>

          <div className="container mx-auto px-4 my-4 text-gray-400 text-sm text-center border-t border-neutral-600">
            <h1 className="text-center font-extrabold text-3xl py-3">
              {t('Dinero Sweeps')}
            </h1>
            <p className="p-2">
              NO PURCHASE REQUIRED to participate in the Sweepstakes.
              Sweepstakes are VOID WHERE PROHIBITED BY LAW. Please refer to the
              &nbsp;
              <span
                className="text-white underline cursor-pointer font-semibold"
                onClick={() => {
                  handleOpenTerms();
                }}
              >
                terms of service
              </span>
            </p>
            <p className="p-2">{t('dinerosweepsrights')}.</p>

            {/* this things are not required at that time  */}

            <p className="pt-2">
              {t('support')}:
              <span className="text-white hover:underline cursor-pointer">
              support@dinerosweeps.com
              </span>{' '}
              | {t('business')}:{' '}
              <span className="text-white hover:underline cursor-pointer">
              support@dinerosweeps.com{' '}
              </span>
            </p>
            {/* <p>{t('cooperationWelcome')}</p>
          <p className="pt-2">{t('version')}: 2.1.1</p>
          <p>{t('serverTime')}: 2024-11-15 10:47:57</p>
          <div className="flex justify-between mx-2">
            <Image src={poweredByImg} alt="powered by softswiss" />
            <Image
              src={installButton}
              alt="app download button"
              className="cursor-pointer"
            />
          </div> */}
          </div>
        </>
      )}
      {isOpen && <Faucet handleClick={handleClick} isOpen={isOpen} />}
    </>
  );
};

export default Footer;
