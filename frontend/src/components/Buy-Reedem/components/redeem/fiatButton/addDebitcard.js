import { uploadDebitCardToken } from '@/services/postRequest';
import { useStateContext } from '@/store';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
// import { CardType } from '@coinflow-react';
// import { CARD_TYPE_MAPPING } from '@coinflowlabs/react';

export default function AddDebitCard() {
  const ref = useRef(null);
  const [tokennn, setTokennn] = useState(null);
  const [expYear, setExpYear] = useState('');
  const [expMonth, setExpMonth] = useState('');

  const {
    state : { user },
  } = useStateContext();

  const CoinflowCardOnlyInput = dynamic(
    () => import('@coinflowlabs/react').then((mod) => mod.CoinflowCardOnlyInput),
    { ssr: false }
  );

  const handleTokenization = async () => {
    if (!ref.current) return;
    try {
      const tokenData = await ref.current.getToken({
        expMonth: expMonth,
        expYear: expYear
      });

      if (!tokenData?.token) {
        throw new Error('No token received.');
      }

      console.log('Received token:', tokenData.token);     // just want to check the received token data

      setTokennn(tokenData.token);
      await uploadDebitCardToken({
        token : tokenData.token,
        expMonth : expMonth,
        expYear : expYear,
        // lastFour : 
        address1 : user?.userDetails?.address || '',
        city : user?.city || '',
        state : user?.State?.stateCode || '',
        zip : user?.userDetails?.zip || '',
        // country: "US"
      });
    } catch (err) {
      console.error('Tokenization failed:', err);
      alert('Failed to tokenize card. See console for details.');     // just want to check the received token error
    }
  };


  return (
    <>
      <div style={{ height: '50px' }}>
        <CoinflowCardOnlyInput
          merchantId={process.env.NEXT_PUBLIC_DEFAULT_MERCHANT_ID || ''} // Replace with your merchant ID
          ref={ref}
          //   cardType={CARD_TYPE_MAPPING} // Or MASTERCARD, AMEX, etc.
          token={tokennn}
          env="sandbox"
          debug={true}
          css={{
            base: 'font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
            focus: 'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
            error: 'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
            cvv: {
              base: 'font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
              focus: 'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
              error: 'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
            },
          }}
          origins={process.env.NEXT_PUBLIC_APP_PROD_URL || 'http://localhost:3000'}
        />
      </div>

      <div className="flex flex-col gap-1 w-full items-center" >
        <input
          placeholder="Expiry Month"
          className="px-4 py-3 h-8 outline-none text-md rounded-lg "
          value={expMonth}
          onChange={e => setExpMonth(e.target.value)}
          style={{ maxHeight: '50px', border: '1px solid white' }}
        />

        <input
          placeholder="Expiry Year"
          className="px-4 h-8 outline-none text-md rounded-lg"
          value={expYear}
          onChange={e => setExpYear(e.target.value)}
          style={{ maxHeight: '50px', border: '1px solid white' }}
        />

        <button
          onClick={handleTokenization}
          className="bg-green-600 text-white py-2 px-4 rounded mt-3"
        >
          Add Card
        </button>
      </div>
    </>
  );
}
