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

const NavMobile = () => {
  const { state, dispatch } = useStateContext();
  const router = useRouter();
  const { t, handleButtonClick, isOpen, handleClick, activeUrl } = useHeader();

  return (
    <div className="flex md:hidden items-center justify-between bg-[rgb(var(--header))] box-border py-2 sticky bottom-0 z-[11]">
      <button
        className="opacity-60 hover:opacity-100 px-4 sm:px-5 py-1 rounded-full flex flex-col items-center"
        onClick={() =>
          dispatch({ type: 'SET_RIGHT_PANEL', payload: !state.rightPanel })
        }
      >
        <Image
          src={chatIcon}
          width={22}
          height={22}
          alt="chat-icon"
          className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]"
        />
        <span className="text-white text-xs font-bold">{t('Chat')}</span>
      </button>

      <button
        onClick={() => {
          handleButtonClick('buy');
        }}
        className="opacity-60 hover:opacity-100 px-4 sm:px-5 py-1 rounded-full flex flex-col items-center"
      >
        <Image
          src={bets}
          width={22}
          height={22}
          alt="bets-icon"
          className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]"
        />
        <span className="text-white text-xs font-bold">{t('Buy')}</span>
      </button>

      <button
        onClick={() => router.push('/')}
        className="opacity-60 hover:opacity-100 px-4 sm:px-5 py-1 rounded-full flex flex-col items-center"
      >
        <Image
          src={homeIcon}
          width={22}
          height={22}
          alt="wallet-icon"
          className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]"
        />
        <span className="text-white text-xs font-bold">{t('Home')}</span>
      </button>

      <button
        onClick={() => {
          handleButtonClick('faucet');
        }}
        className="opacity-60 hover:opacity-100 px-4 sm:px-5 py-1 rounded-full flex flex-col items-center"
      >
        <Image
          src={faucetIcon}
          width={22}
          height={22}
          alt="faucet-icon"
          className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]"
        />
        <span className="text-white text-xs font-bold">{t('Faucet')}</span>
      </button>

      <button
        className="opacity-60 hover:opacity-100 px-4 sm:px-5  py-1 rounded-full flex flex-col items-center"
        onClick={() =>
          dispatch({ type: 'SET_LEFT_PANEL', payload: !state.leftPanel })
        }
      >
        <Image
          src={toggleMenuRight}
          width={22}
          height={22}
          alt="menu-icon"
          className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]"
        />
        <span className="text-white text-xs font-bold">{t('Menu')}</span>
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
