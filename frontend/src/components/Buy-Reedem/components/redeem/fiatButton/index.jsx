'use client';

import useFiatCrypto from '@/components/Buy-Reedem/hooks/useFiatCrypto';
import { useState } from 'react';
// import AddDebitCard from './addDebitcard';
import AddAccount from './addAccount';

export default function FiatCrypto({ handleCloseDialog }) {
  const [selectedOption, setSelectedOption] = useState('');
  const { handleGetAccounts, accounts } = useFiatCrypto();

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    if (value === 'bank') {
      handleGetAccounts();
    }
  };
  
  return (
    <>

        <div className="text-white font-semibold flex flex-col gap-4">
          <h1>Choose withdraw option:</h1>

          <select
            onChange={handleChange}
            value={selectedOption}
            className="min-w-[250px] bg-blue-900 text-white p-2 rounded"
          >
            <option value="" disabled>Select Withdrawal Method</option>
            <option value="bank">Add Bank Account</option>
            {/* <option value="card">Add Debit Card</option> */}
          </select>
        </div>

      {/* {selectedOption === 'card' && <AddDebitCard />} */}
      {selectedOption === 'bank' && <AddAccount accounts={accounts} handleCloseDialog={handleCloseDialog} />}
    </>
  );
}
