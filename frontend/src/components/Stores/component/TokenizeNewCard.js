'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cardPayments } from '@/services/postRequest';
import { useStateContext } from '@/store';
import CustomToast from '@/common/components/custom-toaster';
// Dynamically import Coinflow components to prevent SSR issues
const CoinflowCardNumberInput = dynamic(
  () =>
    import('@coinflowlabs/react').then((mod) => mod.CoinflowCardNumberInput),
  { ssr: false }
);

const CoinflowCvvInput = dynamic(
  () => import('@coinflowlabs/react').then((mod) => mod.CoinflowCvvInput),
  { ssr: false }
);

function TokenizeNewCard({ selectedPackage, handleClick }) {
  const [cardFormExp, setCardFormExp] = useState('');
  const [name, setName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastStatus, setToastStatus] = useState('success');
  const [isClient, setIsClient] = useState(false);
  // const [browser, setBrowser] = useState('Unknown');
  const cardRef = useRef(null);
  const { state } = useStateContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async () => {
    try {
      if (!cardRef.current) {
        console.error('cardRef.current is null');
        setToastMessage('Card input not initialized.');
        setToastStatus('error');
        setShowToast(true);
        return;
      }

      if (typeof cardRef.current.getToken !== 'function') {
        console.error('getToken is undefined on cardRef');
        setToastMessage('Card component not ready.');
        setToastStatus('error');
        setShowToast(true);
        return;
      }

      const res = await cardRef.current.getToken();
      if (!res?.token) {
        throw new Error('No token returned from getToken');
      }

      const [expMonth, expYearShort] = cardFormExp.split('/');
      const expYear =
        expYearShort.length === 2 ? `20${expYearShort}`.slice(-2) : expYearShort;

      const fullNameParts = name.trim().split(' ');
      const firstName = fullNameParts[0] || 'Test';
      const lastName = fullNameParts.slice(1).join(' ') || 'User';

      const payload = {
        packageId: selectedPackage?.id,
        cardToken: res.token,
        expMonth,
        expYear,
        firstName,
        lastName,
        email: state?.user?.email || 'dattaniture1432@gmail.com',
        address1: state?.user?.userDetails?.address || 'Gandhi Nagar Latur',
        city: state?.user?.city || 'Latur',
        zip: state?.user?.userDetails?.zip || '41351',
        paymentType: 'CARD',
        state: state?.user?.State?.stateCode || 'US',
        lastFour: res?.lastFour || '0000',
        country: 'US',
        saveCard: true,
      };

      const response = await cardPayments(payload);
      
      const success = response?.data?.success;
      const message =
        response?.data?.message || 'Card payment initiated ';

      if (success) {
        setToastMessage(message);
        setToastStatus('success');
        handleClick(); 
      } else {
        setToastMessage('Payment failed');
        setToastStatus('error');
      }
    } catch (err) {
      console.error('Token or API error:', err);
      setToastMessage(err?.data?.message || 'Invalid card details. Please check CVV, card number, or expiration.');
      setToastStatus('error');
    } finally {
      setShowToast(true);
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-3 h-full">
      <input
        placeholder="Card Holdername"
        className="px-2 py-[10px] text-[13px] h-[35px] w-full rounded-sm bg-transparent border"
        onChange={(e) => setName(e.target.value)}
      />

      <div className="w-full h-[35px] border rounded">
        <CoinflowCardNumberInput
          ref={cardRef}
          env="sandbox"
          debug={true}
          expiration={cardFormExp}
          merchantId={process.env.NEXT_PUBLIC_DEFAULT_MERCHANT_ID || ''}
          origins={process.env.NEXT_PUBLIC_APP_PROD_URL || 'http://localhost:3000'}
          // origins={'http://localhost:3000' || ''}
          // origins={'https://orionstarsweeps.com/' || ''} 
          css={{
            base: 'font-family: Montserrat, sans-serif; padding: 0 8px; border: 0px; margin: 0; width: 100%; font-size: 13px; line-height: 35px; height: 32px; box-sizing: border-box; background-color: unset; color : white;',
            focus: 'outline: 0;',
            error:
              'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5); border: 1px solid rgba(224, 57, 57, 0.5);',
          }}
        />
      </div>

      <input
        placeholder="Expiration (MM/YY)"
        className="px-2 py-[10px] text-[13px] h-[35px] w-full rounded-sm bg-transparent border"
        value={cardFormExp}
        onChange={(e) => setCardFormExp(e.target.value)}
      />

      <div className="w-full h-[35px] border rounded flex">
        <CoinflowCvvInput
          env="sandbox"
          merchantId={process.env.NEXT_PUBLIC_DEFAULT_MERCHANT_ID || ''}
          origins={process.env.NEXT_PUBLIC_APP_PROD_URL || 'http://localhost:3000'}
          // origins={'http://localhost:3000' || ''} 
          // origins={'https://orionstarsweeps.com/' || ''} 
          css={{
            base: 'font-family: Montserrat, sans-serif; padding: 0 8px; border: 0px; margin: 0; width: 100%; font-size: 13px; line-height: 35px; height: 32px; box-sizing: border-box; background-color: unset; color : white;',
            focus: 'outline: 0;',
            error:
              'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5); border: 1px solid rgba(224, 57, 57, 0.5);',
          }}
        />
      </div>

      <button
        className="bg-blue-500 px-4 py-2 rounded text-white"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <CustomToast
        showToast={showToast}
        setShowToast={setShowToast}
        message={toastMessage}
        status={toastStatus}
        duration={2000}
      />
    </div>
  );
}

export default TokenizeNewCard;
