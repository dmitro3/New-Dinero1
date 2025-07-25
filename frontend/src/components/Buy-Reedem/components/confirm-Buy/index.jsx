'use client';

import { coins, usd, chevronDown } from '@/assets/svg';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
// import CustomToast from '@/common/components/custom-toaster';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BUY_CURRENCY_LIST } from '../../constants';
import { DepositPayment } from '@/services/postRequest';
// import PaymentPopupWrapper from '@/components/Stores/PaymentPopupWrapper';

const ConfirmBuy = ({ selectedPackage }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [timer, setTimer] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // const [showToast, setShowToast] = useState({ active: false });
  // const [message, setMessage] = useState('');
  // const [status, setStatus] = useState('success');

  // const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  // const handleShowToast = ({ active, message, status }) => {
  //   setShowToast({ active });
  //   setMessage(message);
  //   setStatus(status);
  // };

  const handleCurrencySelect = async (currencyName) => {
    // if (currencyName.toLowerCase() === 'card') {
    //   setShowPaymentPopup(true);
    //   return;
    // }

    setIsProcessing(true);
    setSelectedCurrency(currencyName);

    try {
      const response = await DepositPayment({
        currency: currencyName,
        packageId: selectedPackage.id,
      });

      // const explanation = response?.data?.message;

      // if (explanation) {
      //   handleShowToast({
      //     active: true,
      //     message: explanation,
      //     status: 'info',
      //   });
      //   return;
      // }

      setPaymentData(response.data);
      // handleShowToast({
      //   active: true,
      //   message: response.message,
      //   status: response.status,
      // });

      setIsTimerActive(true);
      setTimer(300);
    } catch (error) {
      console.error('Error during payment processing:', error);
      // handleShowToast({
      //   active: true,
      //   message: error.message || 'Something went wrong',
      //   status: 'error',
      // });
    } 
    setIsProcessing(false);
  };

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      // handleShowToast({
      //   active: true,
      //   message: 'Payment time has expired',
      //   status: 'error',
      // });
      setIsTimerActive(false);
    }
  }, [isTimerActive, timer]);

  if (!selectedPackage) return null;

  return (
    <>
      <div className="text-white mb-2 text-sm">
        <p className="my-2 text-base font-semibold">You will receive</p>
        <div className="p-2 rounded-lg flex items-center justify-start mb-2 bg-[rgb(33,40,83)] h-12">
          <p className="flex items-center gap-2 text-base font-medium">
            {selectedPackage.gcCoin} Gold Coin
            <Image src={coins} alt="coins" className="w-3 h-3 mr-1" />
          </p>
          <p className="flex items-center gap-2 mt-0.5 text-base font-medium">
            + {selectedPackage.scCoin} SC Cash
            <Image src={usd} alt="usd" className="w-3 h-3" />
          </p>
        </div>
        <span className="text-zinc-400 text-sm font-light">
          The exact amount you receive is subject to the real-time exchange rate and the actual send amount at the time of arrival.
        </span>

        <div className="w-full my-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isProcessing}
                className="!w-full flex justify-between h-12 bg-[rgb(33,40,83)] hover:bg-[rgb(44,53,111)] text-white"
              >
                {selectedCurrency ? (
                  <div className="flex justify-start">
                    <Image
                      src={BUY_CURRENCY_LIST.find(c => c.name === selectedCurrency)?.icon}
                      alt={selectedCurrency}
                      height={20}
                      width={20}
                      className="w-8 h-8"
                    />
                    <div className="flex flex-col items-start mx-2">
                      <span className="text-sm">{selectedCurrency}</span>
                      <span className="text-xs text-zinc-500">
                        {BUY_CURRENCY_LIST.find(c => c.name === selectedCurrency)?.description}
                      </span>
                    </div>
                  </div>
                ) : (
                  <h1 className="text-base">Select Payment Method</h1>
                )}
                <Image src={chevronDown} height={20} width={20} alt="drop down icon" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[270px] sm:!w-[400px] bg-[rgb(33,40,83)] p-2 text-white border-none">
              <ScrollArea>
                <DropdownMenuGroup>
                  {BUY_CURRENCY_LIST.map((currency) => (
                    <DropdownMenuItem
                      key={currency.id}
                      onClick={() => handleCurrencySelect(currency.name)}
                      className="flex justify-start !w-full rounded-md data-[highlighted]:!bg-[rgb(44,53,111)] transition-colors cursor-pointer data-[highlighted]:text-white"
                    >
                      <Image src={currency.icon} alt={currency.name} height={16} width={16} className="w-6 h-6" />
                      <div className="flex flex-col mt-2">
                        <span className="text-sm">{currency.name}</span>
                        <span className="text-xs text-zinc-500">{currency.description}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isProcessing && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-300"></div>
          </div>
        )}

        {paymentData && !isProcessing && (
          <>
            <div className="mb-3 flex justify-between items-center p-2 rounded-lg">
              <p className="text-gray-200 font-normal text-base">Send Amount</p>
              <p className="text-base font-semibold flex items-center gap-2">
                {paymentData.estimatedAmount}
                <Image
                  src={BUY_CURRENCY_LIST.find(c => c.name === selectedCurrency)?.icon}
                  alt={selectedCurrency}
                  width={16}
                  height={16}
                />
              </p>
            </div>

            {isTimerActive && (
              <div className="text-sm text-white bg-[rgb(33,40,83)] p-2 h-10 rounded-lg mb-3 hover:bg-[rgb(28,34,75)]">
                Time remaining: {Math.floor(timer / 60)}m {timer % 60}s
              </div>
            )}

            <div className="mb-4">
              <p className="mb-2 text-gray-200">Your {selectedCurrency} Purchase Address</p>
              <div className="flex items-center gap-2 bg-[rgb(33,40,83)] hover:bg-[rgb(28,34,75)] p-3 rounded-lg">
                <Input
                  type="text"
                  readOnly
                  value={paymentData.address}
                  className="flex-1 border-none outline-none bg-transparent font-medium"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(paymentData.address);
                    // handleShowToast({ active: true, message: 'Address copied successfully!', status: 'success' });
                  }}
                  className="p-1.5 bg-transparent hover:bg-[rgb(45,55,98)] rounded transition-colors"
                  title="Copy address"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="flex justify-center h-60 mb-4 p-2 rounded-lg">
              <QRCode
                value={paymentData.address}
                size={100}
                style={{ height: '80%', maxWidth: '70%', width: '70%' }}
                viewBox="0 0 256 256"
                fgColor="black"
                bgColor="white"
              />
            </div>
          </>
        )}
      </div>

     {/* {showToast?.active && <CustomToast showToast={showToast} setShowToast={setShowToast} message={message} status={status} />} */}

      {/* {showPaymentPopup && (
        <PaymentPopupWrapper onClose={() => setShowPaymentPopup(false)} />
      )} */}
    </>
  );
};

export default ConfirmBuy;
