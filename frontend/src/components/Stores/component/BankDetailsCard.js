import React from 'react';

export default function BankDetailsCard() {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white border border-gray-200 max-w-md mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Bank Account Details</h2>

      <div className="space-y-2">
        <div>
          <span className="font-medium">Bank Name:</span> Chase Bank
        </div>
        <div>
          <span className="font-medium">Account Type:</span> Checking (Individual)
        </div>
        <div>
          <span className="font-medium">Account Name:</span> Aman Kumar
        </div>
        <div>
          <span className="font-medium">Currency:</span> USD
        </div>
        <div>
          <span className="font-medium">Available Balance:</span> $5,200.75
        </div>
        <div>
          <span className="font-medium">Routing Number:</span> 021000021
        </div>
        <div>
          <span className="font-medium">Account Number:</span> ••••5678
        </div>
      </div>
    </div>
  );
}
