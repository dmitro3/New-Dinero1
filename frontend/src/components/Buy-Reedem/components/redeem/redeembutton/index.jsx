'use client';
import {
  chevronDown,
  circleHelp,
  equalApprox,
  usd,
  warningIcon,
  // warningIcon,
} from '@/assets/svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import useReedem from '../../../hooks/useReedem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Controller } from 'react-hook-form';
import CustomToast from '@/common/components/custom-toaster';
import { useRouter } from 'next/navigation';

const Redeem = ({ handleCloseDialog }) => {
  const {
    handleClick = () => { },
    handleSelect = () => { },
    selectedCrypto,
    cryptoCurency = [],
    control = {},
    handleSubmit = () => { },
    onSubmit = () => { },
    setShowToast,
    showToast,
    message,
    status,
    loading,
    isEmailVerified,
    redeemableBalance,
    isValid,
    t,
    convertedData,
    setInputAmount,
    handleConversion,
    veriffStatus,
  } = useReedem();

  const [debouncedAmount, setDebouncedAmount] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (debouncedAmount > 0) {
        handleConversion(selectedCrypto.name);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [debouncedAmount, selectedCrypto.name]);


  return (
    <>
      {
        veriffStatus === 'approved' ? (
          <>
            <div className="flex justify-center my-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    onClick={handleClick}
                    className="bg-[rgb(var(--lb-blue-500))] hover:bg-[rgb(var(--lb-blue-600))] text-white "
                  >
                    <Image
                      src={selectedCrypto?.icon}
                      alt={selectedCrypto?.name}
                      height={20}
                      width={20} />
                    {selectedCrypto?.name?.toUpperCase()}
                    <Image
                      src={chevronDown}
                      height={20}
                      width={20}
                      alt="drop down icon" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[rgb(var(--lb-blue-400))] p-2 text-white border-none">
                  <ScrollArea className="h-56">
                    <DropdownMenuGroup>
                      {cryptoCurency?.map((crypto) => (
                        <DropdownMenuItem
                          key={crypto.id}
                          // onClick={() => handleSelect(crypto)}
                          onClick={() => {
                            handleSelect(crypto);
                            // handleConversion(crypto.name);
                          }}

                        >
                          <Image
                            src={crypto.icon}
                            alt={crypto.name}
                            height={16}
                            width={16} />
                          <span>{crypto.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-3 text-white my-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="flex flex-col">
                      {t('amountToRedeem')}
                      <span className="text-gray-500 text-xs">{t('minSC')}</span>
                    </Label>
                    <div>
                      <Label className="flex flex-col">
                        <p className="flex items-center">
                          {t('redeemable')}
                          <Image
                            src={circleHelp}
                            alt="circle help icon"
                            height={20}
                            width={20}
                            className="m-1" />
                        </p>
                        <div className="flex items-center">
                          <Image
                            src={equalApprox}
                            alt="equal approx"
                            height={12}
                            width={12} />
                          <span className="text-green-400 text-xs underline">
                            {redeemableBalance}{' '}
                            {t('sc')}
                          </span>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="relative">
                    <Controller
                      control={control}
                      name="amount"
                      rules={{
                        required: 'Amount is required',
                        min: {
                          value: 30,
                          message: 'Minimum redeemable amount is 30SC.',
                        },
                        max: {
                          value: parseFloat(redeemableBalance),
                          message: 'You do not have enough redeemable balance in your account',
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            disabled={!isEmailVerified}
                            type="text"
                            {...field}
                            className="text-white rounded-md bg-[rgb(var(--lb-blue-900))] p-5 border-2 border-[rgb(var(--lb-blue-400))]"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(e);
                              setInputAmount(Number(value));
                              setDebouncedAmount(Number(value));
                            }} />
                          <Image
                            src={usd}
                            alt="usd"
                            height={20}
                            width={20}
                            className="absolute right-2 mt-5 top-0 transform -translate-y-1/2" />
                          {fieldState.error && (
                            <span className="text-red-500 text-sm">
                              {fieldState.error.message}
                            </span>
                          )}
                        </>
                      )} />
                  </div>
                </div>

                <div>
                  <Label>{t('bitcoinAddress')}</Label>
                  <Controller
                    control={control}
                    name="address"
                    rules={{
                      required: 'Address is required',
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          disabled={!isEmailVerified}
                          type="text"
                          {...field}
                          className="text-white rounded-md bg-[rgb(var(--lb-blue-900))] p-5 border-2 border-[rgb(var(--lb-blue-400))]" />
                        {fieldState.error && (
                          <span className="text-red-500 text-sm">
                            {fieldState.error.message}
                          </span>
                        )}
                      </>
                    )} />
                </div>

                {selectedCrypto && control._formValues?.amount && (
                  <div className="bg-[rgb(var(--lb-blue-900))] text-white p-4 rounded-md my-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold text-sm">
                      {t('Estimated receive')}
                    </span>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Image
                        src={selectedCrypto.icon}
                        alt={selectedCrypto.name}
                        height={16}
                        width={16} />
                      <span className="text-green-400 font-bold">
                        {/* Assuming 1 SC = selectedCrypto.rate (just an example, you might need real conversion logic) */}
                        {(
                          parseFloat(convertedData || 0)).toFixed(6)}{' '}
                        {selectedCrypto.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-[rgb(var(--lb-blue-900))] p-3 rounded-md">
                  <p className="text-gray-400">{t('redemptionNote')}</p>
                </div>

                <Button
                  loading={loading}
                  disabled={loading || !isEmailVerified || !isValid}
                  type="submit"
                  className="w-full bg-green-400 hover:bg-green-300 cursor-pointer text-black"
                >
                  {t('redeem')}
                </Button>

                <CustomToast
                  showToast={showToast}
                  setShowToast={setShowToast}
                  message={message}
                  status={status} />
              </form>
            </div>
          </>
        ) : (
          <div className="border border-red-500 bg-[rgb(var(--lb-blue-900))] text-white text-center p-3 font-semibold">
            <p className="text-2xl flex justify-center items-center">
              <Image src={warningIcon} alt="warning icon" className="mx-2" />
              {t('warning')}:
            </p>
            <p className="my-2" >
              {t('redeemAfter')}&nbsp;
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  router.push('/setting?active=verify');
                  handleCloseDialog();
                }}
              >
                {t('settingVeriffStatus')}.
              </span>
            </p>
          </div>
        )
      }

    </>
  );
};

export default Redeem;
