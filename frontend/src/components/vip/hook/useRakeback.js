'use client';
import { useState } from 'react';
import { CurrencyList } from '../constants';

const useRakeback = () => {
    const currencyList = CurrencyList;
    const [currency, setCurrency] = useState(currencyList[1]);
    const handleSelect = (item) => {
        setCurrency(item);
    };
    return {CurrencyList, currency, handleSelect,};
};
export default useRakeback;