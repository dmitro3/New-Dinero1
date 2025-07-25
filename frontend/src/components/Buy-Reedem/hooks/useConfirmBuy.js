
import { useState,useEffect,useCallback} from 'react';
import { createPayment } from '@/services/postRequest';


 const useConfirmBuy=({selectedPackage})=>{
  const [buyPacakageError, setBuyPacakageError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [timer, setTimer] = useState(900);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('success');

  const startTimer = useCallback(() => {
      setIsTimerActive(true);
  
      setTimer(900);
    }, []);
  
    useEffect(() => {
      if (isTimerActive) {
        if (timer > 0) {
          const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
          return () => clearTimeout(countdown);
        } else {
          setIsTimerActive(false);
          setTimer(900);
          setPaymentData(null);
        }
      }
    }, [timer, isTimerActive]);

    const handleCurrencySelect = async (currency) => {
        if (!selectedPackage || !currency) return;
        setSelectedCurrency(currency);
        setIsProcessing(true);
        try {
          const payload = {
            packageId: selectedPackage.id,
            currency: currency
          };
          const response = await createPayment(payload);
          setPaymentData(response.data);
          startTimer();
        } catch (error) {
          setBuyPacakageError(error.message);
        } finally {
          setIsProcessing(false);
        }
      };

      const clearSelectedPackage = () => {
        setSelectedCurrency('');
        setPaymentData(null);
      };
    
      const handleShowToast=(data)=>{
        setShowToast(data.active);
        setMessage(data.message);
        setStatus(data.status);
      };

      return {
        clearSelectedPackage,
        buyPacakageError,
        isProcessing,
        selectedCurrency,
        handleCurrencySelect,
        paymentData,
        timer,
        isTimerActive,
        showToast,
        setShowToast,
        message,
        status,
        handleShowToast,
      };
    };

    export default useConfirmBuy;