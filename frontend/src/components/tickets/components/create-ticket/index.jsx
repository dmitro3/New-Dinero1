import React from 'react';
import { Controller } from 'react-hook-form';
import CustomSelect from '@/common/components/custom-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useCreateTicket from '../../hook/useCreateTicket';
import CustomToast from '@/common/components/custom-toaster';
import { selectOptions } from '../../constant';

const CreateTicket = ({ handleClick }) => {
  const {
    loading,
    message,
    onSubmit,
    showToast,
    status,
    setShowToast,
    control,
    handleSubmit,
    t,
  } = useCreateTicket({ handleClick });

  return (
    <>
      <div className="w-[100%] px-3 border-b border-dotted border-white py-2 mb-2">
        <ol className="text-sm text-[rgb(var(--lb-blue-200))]">
          <h3>{t('notice')}</h3>
          <li>1. {t('ticketDescription')}</li>
          <li>2. {t('ticketClosureWarning')}</li>
          <li>3. {t('ticketResponseTime')}</li>
          <li>4. {t('weekendResponseTime')}</li>
        </ol>
      </div>

      <div className="w-[100%] px-3 mb-2">
        <h3 className="text-white font-bold text-sm">{t('createNewTicket')}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Controller
            name="category"
            control={control}
            render={({ field }) => ( */}
          <CustomSelect
            // {...field}
            options={selectOptions}
            className="w-full mt-2"
          />
          {/* )}
          /> */}
          <Controller
            name="subject"
            control={control}
            rules={{ required: 'Subject is required' }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type="text"
                  placeholder="Subject"
                  className="text-white my-2 rounded-md bg-[rgb(var(--lb-blue-900))] p-5 border-2 border-[rgb(var(--lb-blue-900))]"
                />
                {fieldState.error && (
                  <span className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
          <Controller
            name="body"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  {...field}
                  placeholder="Describe the problem you're having in great detail"
                  className="text-white w-full my-2 rounded-md bg-[rgb(var(--lb-blue-900))] p-5 border-2 border-[rgb(var(--lb-blue-900))]"
                />
                {fieldState.error && (
                  <span className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
          <div className="w-full flex justify-center my-2">
            <Button
              type="submit"
              className="bg-green-400 p-5 px-10 hover:bg-green-300 cursor-pointer font-bold text-black"
              disabled={loading}
              loading={loading}
            >
              {t('submit')}
            </Button>
          </div>
        </form>
      </div>

      <CustomToast
        message={message}
        setShowToast={setShowToast}
        status={status}
        showToast={showToast}
      />
    </>
  );
};

export default CreateTicket;
