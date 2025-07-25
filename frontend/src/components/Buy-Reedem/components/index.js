import { cross, storeIcon } from '@/assets/svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tab from './tab';
import { useStateContext } from '@/store';
import { useIsMobile } from '@/hooks/use-mobile';

const TAB_LABEL_MAPPING = {
  buy: 'Buy Transaction',
  redeem: 'Redeem Transaction',
  rains: 'Rain Transaction',
  tips: 'Tips Transaction',
  confirmBuy: 'Credit Issue? Ticket!'
};

const BuyReedem = ({ isOpen, handleClick, buttonType }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(buttonType || 'buy');
  const [showTransactions, setShowTransactions] = useState(false);
  const router = useRouter();
  const { dispatch } = useStateContext();
  const isMobile = useIsMobile();
  const handleNavigate = () => {
    if(currentTab==='confirmBuy'){
      router.push('/tickets');
      handleClick();
    }
    else{
    setShowTransactions(true);
    router.push(`/transactions?active=${currentTab}`);
    }
    if (isMobile) {
      dispatch({
        type: 'SET_RIGHT_PANEL',
        payload: false,
      });
    }
  };

  return (
    <>
      {!showTransactions && (
        <Dialog open={isOpen} onOpenChange={handleClick}>
          <DialogContent className="max-w-lg mx-auto mb-6 rounded-lg shadow-lg border-none h-[500px] overflow-y-auto scrollable-Content">
            <DialogHeader className="flex flex-row justify-between max-h-10">
              <div className="flex justify-center items-center space-x-2">
                <Image src={storeIcon} alt="store image" />
                <DialogTitle className="text-white">{t('store')}</DialogTitle>
              </div>
              <div className="flex">
                <p
                  className="text-green-400 mr-3 font-semibold underline text-sm cursor-pointer"
                  onClick={handleNavigate}
                >
                  {TAB_LABEL_MAPPING[currentTab]}
                </p>
                <Image
                  src={cross}
                  alt="close icon"
                  onClick={handleClick}
                  className="invert hover:bg-gray-500 rounded-3xl"
                />
              </div>
            </DialogHeader>
            {currentTab==='confirmBuy'?<div className="flex h-auto max-h-[600px]">
              <Tab
                buttonType={buttonType}
                onTabChange={setCurrentTab}
                handleCloseDialog={handleClick}
              />
            </div>:(<div
              style={{
                maxHeight: '25rem',
                overflowY: 'auto',
              }}
              className="scrollable-Content p-1"
            >
              <Tab
                buttonType={buttonType}
                onTabChange={setCurrentTab}
                handleCloseDialog={handleClick}
              />
            </div>)}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BuyReedem;
