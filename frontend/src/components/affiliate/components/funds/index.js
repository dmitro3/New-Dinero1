'use strict;';
import { usd } from '@/assets/svg';
import Image from 'next/image';
const Funds = () => {
  return (
    <div className="flex flex-col w-full border border-[rgb(var(--lb-blue-300))] text-gray-300 rounded-lg p-4">
      {/* Balance Section */}
      <div className="mb-4">
        <h2 className=" font-semibold text-white mb-3">Balance</h2>
        <div className="flex justify-between gap-4 bg-[hsl(var(--side-bar-card))] px-4 py-2 rounded-lg max-w-[400px]">
          {/* <div className="grid grid-cols-3 gap-4 bg-[hsl(var(--side-bar-card))] p-4 rounded-lg"> */}
          {/* Total Commission */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 text-center font-bold leading-none">
              Total Commission
            </span>
            <div className="flex items-center mt-1">
              <Image src={usd} alt="coin icon" className="w-4 h-4 mr-1" />
              <span className="text-[13px] font-semibold">0.0000</span>
            </div>
          </div>
          {/* Available Commission */}
          <div className="flex flex-col items-center border-l border-r border-[rgb(var(--lb-blue-300))] pr-2 pl-2">
            <span className="text-sm text-gray-400 text-center font-bold leading-none">
              Available Commission
            </span>
            <div className="flex items-center mt-1">
              <Image src={usd} alt="coin icon" className="w-4 h-4 mr-1" />
              <span className="text-[13px] font-semibold">0.0000</span>
            </div>
          </div>
          {/* Cashout History */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 text-center font-bold leading-none">
              Cashout History
            </span>
            <div className="flex items-center mt-1">
              <Image src={usd} alt="coin icon" className="w-4 h-4 mr-1" />
              <span className="text-[13px] font-semibold">0.0000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cashout Section */}
      <div>
        <h2 className="font-semibold text-white mb-3">Cashout</h2>
        <div className="rounded-lg max-w-[400px]">
          {/* Min Transfer and Available */}
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Min Transfer</span>
            <span>Available</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300 mb-4">
            <span className="text-green-400">0.01 SC</span>
            <span>0.0000 SC</span>
          </div>

          {/* Input Field */}
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 bg-[hsl(var(--side-bar-card))] text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="0.0000"
            />
            <Image
              src={usd}
              alt="coin icon"
              className="absolute top-1/2 transform -translate-y-1/2 right-4 w-5 h-5"
            />
          </div>

          {/* Instruction */}
          <p className="text-sm text-gray-400 mb-4">
            Transfer affiliate commission to your game balance.
          </p>

          {/* Button */}
          <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition">
            Cashout to Game Balance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Funds;
