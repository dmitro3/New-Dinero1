'use client';
import { equalApprox } from '@/assets/svg';
import CustomToast from '@/common/components/custom-toaster';
import useFiatCrypto from '@/components/Buy-Reedem/hooks/useFiatCrypto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Controller } from 'react-hook-form';

export default function AddAccount({ accounts }) {

  const {
    t,
    handleAddAccounts,
    selectedAccount,
    handleAccountChange,
    handleAmountChange,
    handleWithdrawlAmount,
    showToast,
    message,
    status,
    setToastState,
    control,
    redeemableBalance,
    handleSubmit,
    isValid,
    isRequested,
    // isKycVerified,

  } = useFiatCrypto();

  return (
    <div className="mt-4">
      <p className="text-white font-bold" >Note : <span className="text-white/90 font-semibold" > Only for US country.</span></p>
      <button
        value="new"
        onClick={(e) => {
          e.stopPropagation();
          handleAddAccounts();
        }}
        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold"
      >
        Add new Account
      </button>

      {accounts.length > 0 && (
        <div>
          <label
            htmlFor="bankAccountSelect"
            className="block my-2 font-medium text-white"
          >
            Select Existing Bank Account
          </label>
          <select
            id="bankAccountSelect"
            onChange={handleAccountChange}
            value={selectedAccount || 'new'}
            size={4}
            className="w-full p-2 rounded-md text-black bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 overflow-y-auto max-h-40"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflowY: 'auto',
              maxHeight: '10rem',
            }}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.paymentType} - {account.lastFourDigits}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedAccount && selectedAccount !== 'new' && (
        <div className="flex justify-between mb-1">
          <Label className="flex flex-col text-white/80">
            {t('amountToRedeem')}
            <span className="text-gray-400 text-xs">(Min 30 SC)</span>
          </Label>
          <div>
            <Label className="flex flex-col">
              <p className="flex items-center text-green-400 ">
                {t('redeemable')}
              </p>
              <div className="flex items-center">
                <Image
                  src={equalApprox}
                  alt="equal approx"
                  height={12}
                  width={12}
                />
                <span className="text-green-400 text-xs underline">
                  {redeemableBalance}{' '}
                  {t('sc')}
                </span>
              </div>
            </Label>
          </div>
        </div>
      )}

      {selectedAccount && selectedAccount !== 'new' && (
        <div className="space-y-3 text-white my-3">
          <form onSubmit={handleSubmit(handleWithdrawlAmount)}>
            <div>
              <div className="relative">
                <Controller
                  control={control}
                  name="redeemamount"
                  rules={{
                    required: 'Amount is required',
                    min: {
                      value: 30,
                      message: 'Minimum redeemable amount is 30 SC.',
                    },
                    max: {
                      value: parseFloat(redeemableBalance),
                      message:
                        'You do not have enough redeemable balance in your account',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        // disabled={!isEmailVerified}
                        type="number"
                        {...field}
                        onClick={(e) => handleAmountChange(e)}
                        className="w-full p-2 rounded-md text-black bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter amount"
                      />
                      {fieldState.error && (
                        <span className="text-red-500 text-sm">
                          {fieldState.error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <Button
              disabled={!isValid}
              type="submit"
              className={`mt-3 px-4 py-2 rounded-md font-semibold ${isValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-400 cursor-not-allowed text-black'
                }`}
            >
              Confirm Withdrawal
            </Button>

            {
              isValid && isRequested &&
              <p className="text-green-500 mt-1" >Withdrawal request created successfully</p>
            }

            <CustomToast
              showToast={showToast}
              setShowToast={(val) =>
                setToastState((prev) => ({ ...prev, showToast: val }))
              }
              message={message}
              status={status}
              duration={2000}
            />
          </form>
        </div>
      )}
    </div>
  );
}