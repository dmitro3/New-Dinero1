'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import React, { useState } from 'react';
import useRakeback from '../../hook/useRakeback';
import { chevronDown } from '@/assets/svg';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const Rakeback = () => {
  const { CurrencyList, currency, handleSelect } = useRakeback();

  const [rakebackValue, setRakebackValue] = useState('');
  const [redeemValue, setRedeemValue] = useState('');

  const handleMaxClick = () => {
    const currentValue = parseFloat(redeemValue) || 0;
    setRedeemValue((currentValue + 1).toFixed(4));
  };

  const isFormValid = rakebackValue.trim() !== '' && redeemValue.trim() !== '';

  return (
    <div className="text-white w-full bg-[rgb(var(--lb-blue-800))] pt-1 mt-1 px-2 rounded-lg pb-6">
      <div className="flex justify-center my-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[rgb(var(--lb-blue-900))]  hover:bg-[rgb(var(--lb-blue-400))]  text-white w-[120px]">
              <Image
                src={currency.icon}
                alt={currency.name}
                className="h-5 w-5"
              />
              {currency?.name}
              <Image src={chevronDown} alt="drop down icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[rgb(var(--lb-blue-400))] p-2 text-white border-none">
            <DropdownMenuGroup>
              {CurrencyList.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleSelect(item)}
                >
                  <Image src={item.icon} alt={item.name} className="h-4 w-4" />
                  <span>{item.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <form>
        <div className="my-2">
          <div className="flex justify-between">
            <Label>Rakeback</Label>

            <span className="text-orange-400 font-semibold text-sm">
              (Activity rate 5%)
            </span>
          </div>
          <Input
            type="number"
            value={rakebackValue}
            onChange={(e) => setRakebackValue(e.target.value)}
            className="text-white rounded-md border-[rgb(var(--lb-blue-400))] border-2 bg-[rgb(var(--lb-blue-900))] p-2 scrollable-Content"
          />
        </div>
        <div className="my-2">
          <div className="flex justify-between">
            <Label>Redeem From Rake Balance</Label>

            <span className="text-gray-400 font-semibold text-sm">
              (Min: 0.0100)
            </span>
          </div>
          <div className="flex items-center border border-[rgb(var(--lb-blue-400))]  bg-[rgb(var(--lb-blue-400))] rounded-md">
            <div className="relative w-full">
              <Input
                type="number"
                value={redeemValue}
                onChange={(e) => setRedeemValue(e.target.value)}
                className="text-white rounded-md bg-[rgb(var(--lb-blue-900))] p-5 border-2 border-[rgb(var(--lb-blue-400))] scrollable-Content"
              />
              <Image
                src={currency?.icon}
                alt={currency?.name}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
              />
            </div>
            <Button
              type="button"
              onClick={handleMaxClick}
              className="bg-[rgb(var(--lb-blue-400))]  hover:bg-[rgb(var(--lb-blue-400))] text-white w-[120px]"
            >
              Max
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-green-400 p-5 hover:bg-green-300 cursor-pointer text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Claim
        </Button>
      </form>
    </div>
  );
};

export default Rakeback;