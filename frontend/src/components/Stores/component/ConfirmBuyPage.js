'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { bitcoin, gpay, applepayss, credit, bank } from '@/assets/png';
import dynamic from 'next/dynamic';
import {
  CoinflowGooglePayButton,
  CoinflowApplePayButton,
} from '@coinflowlabs/react';
import { getAccount } from '@/services/getRequests';
import { getUserDetails } from '@/services/getRequests';
import { useBankTransfer } from '../hooks/useBankTransfer';
import { makeAchPayment, WebHook } from '@/services/postRequest';
const TokenizeNewCard = dynamic(() => import('./TokenizeNewCard'), {
  ssr: false,
});

const ExistingCardPayment = dynamic(() => import('./ExistingCardPayment'), {
  ssr: false,
});

import useCoinFlowSessionKey from '../hooks/useCoinFlowSessionKey';
import ConfirmBuy from '@/components/Buy-Reedem/components/confirm-Buy';
import { cross } from '@/assets/svg';
import CustomToast from '@/common/components/custom-toaster';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ConfirmBuyPage = ({
  selectedPackage,
  setActive = () => {},
  handleClick,
  handleCloseDialog,
  // merchantId,
  // solanaWalletAddress,
}) => {
  const {
    openPlaid,
    loading: bankLoading,
    error: bankError,
    success: achPaymentSuccess,
    currentStep,
    fetchLinkToken,
    showToast,
    setShowToast,
    toastMessage,
    setToastMessage,
    toastStatus,
    setToastStatus,
  } = useBankTransfer();

  const [showBankUI, setShowBankUI] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  const [paymentSelected, setPaymentSelected] = useState(null);
  const [showCryptoUI, setShowCryptoUI] = useState(false);
  const [showCardUI, setShowCardUI] = useState(false);
  // const [upiId, setUpiId] = useState('');
  // const [upiError, setUpiError] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  // const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState('new');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [webhookInfo, setWebhookInfo] = useState(null);

  const paymentMethods = [
    { src: credit, alt: 'Credit Card', label: 'Credit Card', path: 'card' },
    { src: gpay, alt: 'Google Pay', label: 'Google Pay', path: 'gpay' },
    { src: applepayss, alt: 'Apple Pay', label: 'Apple Pay', path: 'apay' },
    { src: bank, alt: 'Bank Transfer', label: 'Bank Transfer', path: 'bank' },
    {
      src: bitcoin,
      alt: 'Crypto Currency',
      label: 'Crypto Currency',
      path: 'crypto',
    },
  ];

  // const cryptoCurrencies = [
  //   { src: bitcoin, alt: 'Bitcoin', label: 'Bitcoin', value: 'bitcoin' },
  //   { src: bitcoin, alt: 'USDT', label: 'USDT', value: 'usdt' },
  // ];

  const [filteredMethods, setFilteredMethods] = useState(paymentMethods);
  const { sessionKey, fetchSessionKey } = useCoinFlowSessionKey();

  useEffect(() => {
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isChrome =
      /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(userAgent);

    let filtered = [...paymentMethods];
    if (isSafari)
      filtered = filtered.filter((method) => method.path !== 'gpay');
    else if (isChrome || isEdge)
      filtered = filtered.filter((method) => method.path !== 'apay');

    setFilteredMethods(filtered);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserDetails();
        setUserDetails(response?.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (showBankUI) {
      const fetchAccounts = async () => {
        try {
          const response = await getAccount({ paymentType: 'ACH' });
          const accountsData = response?.data?.data || [];
          setAccounts(accountsData);

          if (accountsData.length > 0) {
            setSelectedAccount(accountsData[0].id || '');
          } else {
            setSelectedAccount('new');
          }
        } catch (err) {
          console.error('Error fetching accounts:', err);
          setAccounts([]);
          setSelectedAccount('new');
        }
      };
      fetchAccounts();
    } else {
      setAccounts([]);
      setSelectedAccount('');
    }
  }, [showBankUI]);

  const handlePaymentClick = async (path) => {
    setPaymentSelected(null);
    setShowBankUI(false);
    setShowCryptoUI(false);
    setShowCardUI(false);
    // setUpiError('');
    // setUpiId('');
    // setSelectedCryptoCurrency('');
    setPaymentError(null);
    setPaymentSuccess(false);
    setPaymentStatus('');

    // fetchLinkToken();
    // fetchSessionKey();
    if (path === 'gpay') {
      try {
        fetchSessionKey();
        const response = await WebHook({
          userId: userDetails?.id,
          packageId: selectedPackage?.id,
          paymentType: 'GOOGLE',
        });

        const webhookData = response?.data?.data;

        if (webhookData) {
          setWebhookInfo(webhookData);
          setPaymentSelected('gpay');
        } else {
          console.error('Invalid webhook response:', response?.errors);
        }
      } catch (err) {
        console.error('Failed to fetch webhook info:', err);
      }
    } else if (path === 'bank') {
      setPaymentSelected('bank');
      setShowBankUI(true);
      fetchLinkToken();
    } else if (path === 'crypto') {
      setPaymentSelected('crypto');
      setShowCryptoUI(true);
      setActive('confirmBuy');
    } else if (path === 'card') {
      fetchSessionKey();
      setPaymentSelected('card');
      setShowCardUI(true);
    } else if (path === 'apay') {
      try {
        fetchSessionKey();
        const response = await WebHook({
          userId: userDetails?.id,
          packageId: selectedPackage?.id,
          paymentType: 'APPLE',
        });

        const webhookData = response?.data?.data;

        if (webhookData) {
          setWebhookInfo(webhookData);
          setPaymentSelected('apay');
        } else {
          console.error('Invalid webhook response:', response?.errors);
        }
      } catch (err) {
        console.error('Failed to fetch webhook info:', err);
      }
      // setPaymentSelected('apay');
    } else {
      setActive(path);
    }
  };

  const handleBankAccountChange = (e) => {
    const accountId = e.target.value;
    setSelectedAccount(accountId);
    setPaymentSuccess(false);
    setPaymentError(null);
  };

  const handleConfirmBankPayment = async () => {
    const selected = accounts.find(
      (acc) => acc.id === parseInt(selectedAccount)
    );
    if (!selected) return;

    try {
      setProcessingPayment(true);
      const response = await makeAchPayment({
        firstName: userDetails?.firstName || 'Test',
        lastName: userDetails?.lastName || 'User',
        packageId: selectedPackage?.id || 59,
        paymentType: 'ACH',
        paymentDetailId: parseInt(selectedAccount),
      });

      setToastStatus(response?.data?.success ? 'success' : 'error');
      setToastMessage(response?.data?.message);
      setPaymentSuccess(true);
    } catch (err) {
      console.error(err);
      setPaymentError(err);
    } finally {
      setProcessingPayment(false);
      setShowToast(true);
    }
  };

  const handlePopupClose = () => {
    setTimeout(() => {
      handleCloseDialog();
      handleClick();
    }, 3000);
  };

  const getBankTransferStatus = () => {
    if (processingPayment) return 'Processing bank transfer...';
    switch (currentStep) {
      case 'plaid':
        return 'Connecting to your bank...';
      case 'exchange':
        return 'Verifying bank details...';
      case 'payment':
        return 'Processing payment...';
      case 'complete':
        return 'Payment successful!';
      default:
        return 'Connect your bank';
    }
  };

  useEffect(() => {
    if (!paymentStatus) return;

    setToastStatus(
      paymentStatus === 'Payment successful!' ? 'success' : 'error'
    );
    setToastMessage(paymentStatus);
    setShowToast(true);
  }, [paymentStatus]);

  return (
    <>
      <div className="relative max-h-[500px] md:max-h-[600px] overflow-y-auto w-full mb-6 p-6 bg-[rgb(20,25,45)] rounded-xl shadow-lg text-white focus:outline-none border-none scrollbar-thin scrollable-Content"
        style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="mb-2">
          <h1 className="text-green-300 text-lg font-semibold flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Secure Checkout
          </h1>
          <Image
            src={cross}
            alt="close"
            height={20}
            width={20}
            className="absolute top-4 right-4 scale-125 cursor-pointer invert hover:bg-gray-500 rounded-xl"
            onClick={handleClick}
          />
        </div>

        <div className="text-sm">
          <p className="mb-1 font-medium">You Will Receive</p>
          <div className="p-3 rounded-lg flex flex-col gap-1 bg-[rgb(33,40,83)] mb-4">
            <p>GC Coin: {selectedPackage?.gcCoin}</p>
            <p>+ SC Cash: {selectedPackage?.scCoin}</p>
          </div>

          <p className="mb-1 font-medium">Choose Payment Type</p>
          <div className="mt-5 text-gray-400 text-sm">
            <div className="flex gap-4 justify-between flex-wrap">
              {filteredMethods.map(({ src, alt, label, path }, idx) =>
                path === 'gpay' ? (
                  <button
                    key={idx}
                    onClick={() => handlePaymentClick(path)}
                    className="cursor-pointer flex flex-col items-center justify-center gap-1 w-16 h-20 bg-[rgb(20,25,45)] hover:bg-[rgb(33,40,83)] p-2 rounded-lg transition ease-in-out duration-200"
                    type="button"
                    aria-label="Google Pay"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      width={30}
                      height={30}
                      className="mb-1"
                    />
                    <p className="text-xs">{label}</p>
                  </button>
                ) : (
                  <button
                    key={idx}
                    onClick={() => handlePaymentClick(path)}
                    className="cursor-pointer flex flex-col items-center justify-center gap-1 w-16 h-20 bg-[rgb(20,25,45)] hover:bg-[rgb(33,40,83)] p-2 rounded-lg transition ease-in-out duration-200"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      width={30}
                      height={30}
                      className="mb-1"
                    />
                    <p className="text-xs">{label}</p>
                  </button>
                )
              )}
            </div>
          </div>
          {paymentSelected === 'apay' && webhookInfo && (
            <div className="mt-4">
              <CoinflowApplePayButton
                env={'sandbox'}
                sessionKey={sessionKey}
                merchantId={process.env.NEXT_PUBLIC_DEFAULT_MERCHANT_ID || ''}
                handleHeightChange={() => {}}
                webhookInfo={webhookInfo}
                subtotal={{
                  cents: selectedPackage.amount * 100,
                  currency: 'USD',
                }}
                color={'black' | 'white'}
                onSuccess={() => {
                  setPaymentStatus('Payment successful!');
                }}
                onError={(error) => {
                  console.error('Apple Pay error:', error);
                  setPaymentStatus(`Payment failed: ${error.message}`);
                }}
              />
              {/* {paymentStatus &&
                (() => {
                  setToastStatus(
                    paymentStatus === 'Payment successful!'
                      ? 'success'
                      : 'error'
                  );
                  setToastMessage(paymentStatus);
                  setShowToast(true);
                })()} */}
              {paymentStatus && (
                <div className="mt-3 p-2 bg-gray-800 rounded-md">
                  <p className="text-sm">Status: {paymentStatus}</p>
                </div>
              )}
            </div>
          )}

          {paymentSelected === 'gpay' && webhookInfo && (
            <div
              className="my-6 mx-auto rounded-xl flex flex-col justify-center items-center"
              style={{
                height: '40px',
                width: '50%',
              }}
            >
              <CoinflowGooglePayButton
                env="sandbox"
                sessionKey={sessionKey}
                merchantId={process.env.NEXT_PUBLIC_DEFAULT_MERCHANT_ID || ''}
                handleHeightChange={() => {}}
                webhookInfo={webhookInfo}
                subtotal={{
                  cents: selectedPackage.amount * 100,
                  currency: 'USD',
                }}
                color="white"
                onSuccess={() => {
                  setPaymentStatus('Payment successful!');
                }}
                onError={(error) => {
                  console.error('Google Pay error:', error);
                  setPaymentStatus(`Payment failed: ${error.message}`);
                }}
              />
              {paymentStatus && (
                <div className="mt-3 p-2 bg-gray-800 rounded-md">
                  <p className="text-sm">Status: {paymentStatus}</p>
                </div>
              )}
            </div>
          )}

          {showBankUI && (
            <div className="mt-4">
              <p className="font-semibold text-white/80">
                When creating new account please select Account type as
                &quot;checking&quot; or &quot;savings&quot;
              </p>
              <button
                value="new"
                onClick={() => {
                  handleClick();
                  handleCloseDialog();
                  openPlaid();
                }}
                className="mt-2 mb-4  px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md "
              >
                Add new Account
              </button>
              {accounts.length > 0 && (
                <div>
                  <label
                    htmlFor="bankAccountSelect"
                    className="block mb-2 font-medium text-white"
                  >
                    Select Existing Bank Account
                  </label>
                  <select
                    id="bankAccountSelect"
                    onChange={handleBankAccountChange}
                    value={selectedAccount || 'new'}
                    size={5}
                    className="w-full p-2 rounded-md text-black bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 overflow-y-auto max-h-40"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      overflowY: 'auto',
                      maxHeight: '8rem',
                    }}
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.paymentType} - {account.lastFourDigits}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={async () => {
                      await handleConfirmBankPayment();
                      handlePopupClose();
                    }}
                    className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                    disabled={
                      !selectedAccount ||
                      selectedAccount === 'new' ||
                      processingPayment
                    }
                  >
                    {processingPayment ? 'Processing...' : 'Confirm Payment'}
                  </button>
                </div>
              )}

              {(bankLoading || processingPayment) && (
                <p className="mt-1">{getBankTransferStatus()}</p>
              )}
              {(bankError || paymentError) && (
                <p className="text-red-500">
                  Error:{' '}
                  {(bankError || paymentError)?.message ||
                    String(bankError || paymentError)}
                </p>
              )}
              {(achPaymentSuccess || paymentSuccess) && (
                <p className="text-green-500">
                  We have received your ACH payment Request. Its now being
                  processed and will be completed shortly.
                </p>
              )}
            </div>
          )}

          {showCryptoUI && <ConfirmBuy selectedPackage={selectedPackage} />}

          {showCardUI && (
            <div className="flex gap-4 mb-4 mt-4">
              <button
                className={`px-4 py-2 rounded ${
                  selectedOption === 'new'
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
                onClick={() => setSelectedOption('new')}
              >
                New Card
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  selectedOption === 'existing'
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
                onClick={() => setSelectedOption('existing')}
              >
                Existing Card
              </button>
            </div>
          )}

          {selectedOption === 'new' && showCardUI && (
            <div className="mt-4" style={{ maxWidth: '100%' }}>
              <TokenizeNewCard
                selectedPackage={selectedPackage}
                handleClick={handleClick}
              />
            </div>
          )}

          {showCardUI && selectedOption === 'existing' && (
            <div className="mt-4" style={{ maxWidth: '100%' }}>
              <ExistingCardPayment
                selectedPackage={selectedPackage}
                handleClick={handleClick}
              />
            </div>
          )}
        </div>
      </div>
      <CustomToast
        showToast={showToast}
        setShowToast={setShowToast}
        message={toastMessage}
        status={toastStatus}
        duration={2000}
      />
    </>
  );
};

export default ConfirmBuyPage;
