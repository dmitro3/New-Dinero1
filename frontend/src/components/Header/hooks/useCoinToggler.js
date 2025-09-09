'use client';
import useGetUserDeatil from '@/common/hook/useGetUserDeatil';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';

const useCoinToggler = (setCurrency = () => {},isPopupRequired)  => {
  const [open, setOpen] = useState(false);
  const {
    state: { selectedCoin },
    state: { user },
    dispatch,
  } = useStateContext();

  const {getUser} = useGetUserDeatil();

  // Load saved coin selection from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoin = localStorage.getItem('selectedCoin');
      if (savedCoin && savedCoin !== selectedCoin) {
        dispatch({ type: 'SET_SELECTED_COIN', payload: savedCoin });
      }
    }
  }, []);

  const hadleToggle = (value) => {
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCoin', value);
    }
    dispatch({ type: 'SET_SELECTED_COIN', payload: value });
  };

  const getBalance = (code) => {
    const wallet = user?.userWallet?.find(
      (data) => data?.currencyCode === code
    );
    return wallet?.balance || '0.0000';
  };

  useEffect(() => {
    if (selectedCoin === 'gold') {
      setCurrency('GC');
    } else {
      setCurrency('PSC');
    }
  }, [selectedCoin, setCurrency]);

 useEffect (()=>{
if (!isPopupRequired) { getUser(selectedCoin);}
 }, [selectedCoin]);

  return { selectedCoin, hadleToggle, open, setOpen, getBalance };
};

export default useCoinToggler;
