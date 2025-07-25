import { useEffect, useState } from 'react';
import { getAccount } from '@/services/getRequests';
import { cardPaymentsExisting } from '@/services/postRequest'; // new API call
import CustomToast from '@/common/components/custom-toaster';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ExistingCardPayment({ selectedPackage, handleClick }) {
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastStatus, setToastStatus] = useState('success');

  useEffect(() => {
    async function fetchSavedCards() {
      try {
        const res = await getAccount();
        const cards = res?.data?.data || [];
        setSavedCards(cards);
      } catch (error) {
        console.error('Failed to fetch cards', error);
      }
    }
    fetchSavedCards();
  }, []);

  const handlePayment = async () => {
    try {
      const payload = {
        packageId: selectedPackage?.id,
        paymentDetailId: selectedCardId,
        paymentType: 'CARD',
      };

      const response = await cardPaymentsExisting(payload);

      const success = response?.data?.success;
      const message = 
        response?.data?.message || 'Payment complete';

      if (success) {
        setToastMessage(message);
        setToastStatus('success');
        handleClick(); 
      } else {
        setToastMessage('Payment failed');
        setToastStatus('error');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setToastMessage('Something went wrong during payment');
      setToastStatus('error');
    }
    finally{
      setShowToast(true);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {savedCards.length === 0 ? (
        <p>No saved cards available.</p>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="px-4 py-2 rounded text-black"
            style={{
              backgroundColor: selectedCardId ? '#065f46' : 'rgb(134 239 172 / var(--tw-bg-opacity))', // dark green / gray-200
              color: selectedCardId ? 'white' : 'black',
            }}
          >
            {selectedCardId
              ? `Selected Card: ${savedCards.find((c) => c.id === selectedCardId)?.lastFourDigits}`
              : 'Select a Saved Card'}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="text-black border mt-2 shadow-lg"
            style={{
              backgroundColor: 'rgb(134 239 172 / var(--tw-bg-opacity))',
              '--tw-bg-opacity': '1',
            }}
          >
            {savedCards.map((card) => (
              <DropdownMenuItem
                key={card.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedCardId(card.id)}
              >
                Card ending in {card.lastFourDigits}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <button
        className="bg-blue-500 px-4 py-2 text-white rounded mt-3"
        onClick={() => {
          handlePayment();
          // handleClick();
        }}
        disabled={!selectedCardId}
      >
        Pay with Selected Card
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

export default ExistingCardPayment;
