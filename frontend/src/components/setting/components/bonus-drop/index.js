import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useBonusDrop from '../../hooks/useBonusDrop';
import CustomToast from '@/common/components/custom-toaster';
import { Controller } from 'react-hook-form';

const BonusDrop = () => {
  const {
    loading,
    control,
    handleSubmit,
    message,
    onSubmit,
    setShowToast,
    showToast,
    status,
  } = useBonusDrop();
  return (
    <section className="border border-[rgb(var(--lb-blue-300))] rounded">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 border-b border-[rgb(var(--lb-blue-300))]">
          <div className="mb-2">
            <div className="text-white text-[14px] font-bold">
              Redeem Bonus Drop
            </div>
            <div className="text-[rgb(var(--lb-blue-250))] text-[14px] mb-2 border-b border-[rgb(var(--lb-blue-300))] pb-3">
              Find bonus drop codes on our social media's such as Twitter &
              Telegram
            </div>
            <div className="text-white text-[14px] font-bold">
              Code <span className="text-red-500">*</span>
            </div>
            <Controller
              name="code"
              control={control}
              rules={{ required: 'bonus drop is required' }}
              render={({ field, fieldState }) => {
                const error = fieldState?.error;
                return (
                  <>
                    <Input
                      {...field}
                      className="border border-[rgb(var(--lb-blue-200))] w-[80%] lg:w-[55%]"
                    />
                    {error && (
                      <div
                        className={`text-red-500 text-sm absolute transition-opacity duration-300 ease-in-out ${
                          error
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2'
                        }`}
                      >
                        {error?.message}
                      </div>
                    )}
                  </>
                );
              }}
            />
          </div>
        </div>
        <div className="mt-0 p-4 flex justify-end">
          <Button
            loading={loading}
            disabled={loading}
            className="bg-green-500 py-2  text-white rounded hover:bg-green-600"
          >
            Submit
          </Button>
        </div>
      </form>
      <CustomToast
        message={message}
        setShowToast={setShowToast}
        showToast={showToast}
        status={status}
      />
    </section>
  );
};
export default BonusDrop;
