import { chevronDown } from '@/assets/svg';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Controller } from 'react-hook-form';
import useTip from '../../hooks/useTip';
import CustomToast from '@/common/components/custom-toaster';

const Tips = ({ handleCloseDialog }) => {
  const {
    currency,
    handleSelect,
    tipCurrencyList,
    checked,
    setChecked,
    t,
    control,
    handleSubmit,
    loading,
    message,
    onSubmit,
    showToast,
    status,
    setShowToast,
  } = useTip({ handleCloseDialog });

  return (
    <div className="text-white w-full">
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
              {tipCurrencyList.map((item) => (
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-2">
          <Label className="font-bold">{t('userName')}</Label>
          <Controller
            name="tipUsername"
            control={control}
            type="text"
            rules={{ required: 'Username is required' }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type="text"
                  placeholder="User Name"
                  className="text-white rounded-md border-[rgb(var(--lb-blue-400))] border-2 bg-[rgb(var(--lb-blue-900))] p-5"
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
        <div className="my-2">
          <Label className="font-bold">{t('tipAmount')}</Label>
          <div className="relative">
            <Controller
              name="tipAmount"
              type="number"
              control={control}
              rules={{
                required: 'Tip Amount is required',
                validate: (value) =>
                  /^[0-9]+$/.test(value) || 'Only numeric values are allowed',
              }}
              render={({ field, fieldState }) => (
                <>
                  <div className="relative">
                    <Input
                      {...field}
                      type="text"
                      placeholder="Tip Amount"
                      className="text-white rounded-md bg-[rgb(var(--lb-blue-900))] p-5 border-2 border-[rgb(var(--lb-blue-400))]"
                    />
                    <Image
                      src={currency?.icon}
                      alt={currency?.name}
                      className={`absolute right-3 top-${fieldState.error ? '[50%]' : '[50%]'} transform -translate-y-1/2 h-5 w-5`}
                    />
                  </div>
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

        <div className="my-5 flex items-center">
          <Controller
            name="isPublic"
            type="checkbox"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Checkbox
                  id="terms"
                  {...field}
                  checked={checked}
                  onCheckedChange={(value) => setChecked(value)}
                />
                {fieldState.error && (
                  <span className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />

          <span className={checked ? 'text-green-400' : ''}>
            {t('makeTipPublic')}
          </span>
        </div>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full bg-green-400 p-5 hover:bg-green-300 cursor-pointer text-black"
        >
          {t('send')} {currency.name}
        </Button>
      </form>
      <p className="text-md text-gray-400 text-center mt-2">
        {t('remainingBalanceWarning')}
      </p>
      <CustomToast
        showToast={showToast}
        setShowToast={setShowToast}
        message={message}
        status={status}
      />
    </div>
  );
};

export default Tips;
