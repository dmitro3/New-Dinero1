'use client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../../ui/button';
import useHeader from '../hooks/useHeader';
import CoinToggler from './CoinToggler';
import Logo from './Logo';
import ProfileSection from './ProfileSection';
import BuyReedem from '@/components/Buy-Reedem/components';

export default function Header() {
  const { t, handleClick, isOpen, clickedButton, handleButtonClick } = useHeader();
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between bg-[rgb(var(--header))] p-1 px-5 sm:px-4 shadow-md sticky top-0 z-[11] h-[60px] md:h-[75px]">
      <Logo />
      <div className="flex items-center justify-center gap-4">
        <CoinToggler />
        {!isMobile && (
          <div className="flex space-x-4">
            <Button
              className="bg-green-400 hover:bg-green-500 w-[67px] h-[42px] leading-[42px] cursor-pointer text-center text-blue-950 font-semibold rounded-[30px]"
              onClick={() => handleButtonClick('buy')}
            >
              {t('buy')}
            </Button>
            <Button
              className="bg-[rgb(var(--secondary-btn-color))] hover:bg-[#24386d90] w-[67px] h-[42px] leading-[42px] cursor-pointer text-center rounded-[30px]"
              onClick={() => handleButtonClick('redeem')}
            >
              {t('redeem')}
            </Button>
          </div>
        )}
      </div>
      <div>
        <ProfileSection />
      </div>
      {isOpen && (
        <BuyReedem
          isOpen={isOpen}
          handleClick={handleClick}
          buttonType={clickedButton}
        />
      )}
    </header>
  );
}
