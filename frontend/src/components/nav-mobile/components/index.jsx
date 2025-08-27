'use client';
import {
  bets,
  chatIcon,
  faucetIcon,
  homeIcon,
  toggleMenuRight,
} from '@/assets/svg';
import useHeader from '@/components/Header/hooks/useHeader';
import DialogComponentsMapping from '@/components/SidebarSection/common/dialog-components';
import { useStateContext } from '@/store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NavMobile = () => {
  const { state, dispatch } = useStateContext();
  const router = useRouter();
  const { t, handleButtonClick, isOpen, handleClick, activeUrl } = useHeader();

  const [activeTab, setActiveTab] = useState('home'); 


  useEffect(() => {
    if (!isOpen) {
      setActiveTab('home');
    }
  }, [isOpen]);

  
  useEffect(() => {
    if (!state.rightPanel) {
      setActiveTab('home');
    }
  }, [state.rightPanel]);


  useEffect(() => {
    if (!state.leftPanel) {
      setActiveTab('home');
    }
  }, [state.leftPanel]);

  const getButtonClasses = (tab) =>
    `px-4 sm:px-5 py-1 rounded-full flex flex-col items-center ${
      activeTab === tab
        ? 'text-green-400 opacity-100'
        : 'text-white opacity-60 hover:opacity-100'
    }`;

  return (
    <div className="flex md:hidden items-center justify-between bg-[rgb(var(--header))] box-border py-2 sticky bottom-0 z-[11]">
      <button
        className={getButtonClasses('chat')}
        onClick={() => {
          dispatch({ type: 'SET_RIGHT_PANEL', payload: !state.rightPanel });
          setActiveTab('chat');
        }}
      >
        <Image src={chatIcon} width={22} height={22} alt="chat-icon" />
        <span className="text-xs font-bold">{t('Chat')}</span>
      </button>

      <button
        onClick={() => {
          handleButtonClick('buy');
          setActiveTab('buy');
        }}
        className={getButtonClasses('buy')}
      >
        <Image src={bets} width={22} height={22} alt="bets-icon" />
        <span className="text-xs font-bold">{t('Buy')}</span>
      </button>

      <button
        onClick={() => {
          router.push('/');
          setActiveTab('home');
        }}
        className={getButtonClasses('home')}
      >
        <Image src={homeIcon} width={22} height={22} alt="home-icon" />
        <span className="text-xs font-bold">{t('Home')}</span>
      </button>

      <button
        onClick={() => {
          handleButtonClick('faucet');
          setActiveTab('faucet');
        }}
        className={getButtonClasses('faucet')}
      >
        <Image src={faucetIcon} width={22} height={22} alt="faucet-icon" />
        <span className="text-xs font-bold">{t('Faucet')}</span>
      </button>

      <button
        className={getButtonClasses('menu')}
        onClick={() => {
          dispatch({ type: 'SET_LEFT_PANEL', payload: !state.leftPanel });
          setActiveTab('menu');
        }}
      >
        <Image src={toggleMenuRight} width={22} height={22} alt="menu-icon" />
        <span className="text-xs font-bold">{t('Menu')}</span>
      </button>

      <DialogComponentsMapping
        isOpen={isOpen}
        handleClick={handleClick}
        activeUrl={activeUrl}
      />
    </div>
  );
};

export default NavMobile;
