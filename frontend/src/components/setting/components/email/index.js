import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useEmail from '../../hooks/useEmail';
import { Controller } from 'react-hook-form';
import CustomToast from '@/common/components/custom-toaster';

const Email = () => {
  const {
    control,
    handleSubmit,
    onOtpSubmit,
    emailSubmitted,
    handleEmailSubmit,
    emailVerified,
    message,
    showToast,
    status,
    setShowToast,
    isOtpLoading,
    isEmailLoading,
    email,
    timer,
    isTimerActive,
  } = useEmail();

  return (
    <section className="border border-[rgb(var(--lb-blue-300))] rounded">
      {emailVerified ? (
        <div className="p-4 border-b border-[rgb(var(--lb-blue-300))]">
          <div className="mb-2">
            <div className="text-white text-[14px] font-bold">
              Current Email
            </div>
            <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">
              (Please check weekly airdrop email every weekend. Don&apos;t miss your
              bonus.)
            </div>

            <Input
              value={email}
              className="border border-[rgb(var(--lb-blue-200))] w-[90%]"
              disabled
            />
          </div>
        </div>
      ) : (
        <>

          <form onSubmit={handleSubmit(handleEmailSubmit)}>
            <div className="p-4 border-b border-[rgb(var(--lb-blue-300))]">
              <div className="mb-2">
                <div className="text-white text-[14px] font-bold">Email</div>
                <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">
                  (Gear up, because every week you&apos;ll unlock an epic bonus email)
                </div>
                <Controller
                  control={control}
                  name="userEmail"
                  rules={{
                    required: 'Please enter email',
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                      message: 'Please enter a valid email address (lowercase only)',
                    },
                  }}
                  render={({ field, fieldState }) => {
                    const error = fieldState?.error;
                    return (
                      <>
                        <div className="flex items-center space-x-2 w-[50%]">
                          <div
                            className={`${error ? 'border-red-500' : 'border-gray-300'
                              } transition-colors duration-200`}
                          >
                            <Input
                              {...field}
                              placeholder="Enter your email"
                              className="border border-[rgb(var(--lb-blue-200))] w-[200%]"
                              onChange={(e) =>
                                field.onChange(e.target.value.toLowerCase())
                              }
                            />
                          </div>
                        </div>
                        {error && (
                          <div
                            className={`text-red-500 text-sm absolute transition-opacity duration-300 ease-in-out ${error
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
            <div className="mt-0 p-4 flex justify-end border-b border-[rgb(var(--lb-blue-300))]">
              <Button
                loading={isEmailLoading}
                disabled={isEmailLoading || emailSubmitted}
                type="submit"
                className="bg-green-500 py-2 text-white rounded hover:bg-green-600"
              >
                Send
              </Button>
            </div>
          </form>

          {/* OTP Form */}
          <form onSubmit={handleSubmit(onOtpSubmit)}>
            <div className="p-4 border-b border-[rgb(var(--lb-blue-300))]">
              <div className="mb-2">
                <div className="text-white text-[14px] font-bold">
                  Verification Code <span className="text-red-500">*</span>
                </div>
                <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">
                  (Haven&apos;t received? Please check junk email)
                </div>
                <Controller
                  control={control}
                  name="otp"
                  rules={{
                    required: emailSubmitted && 'Please enter your Verification Code',
                  }}
                  render={({ field, fieldState }) => {
                    const error = fieldState?.error;
                    return (
                      <div className="w-full md:w-1/2">
                        <div className="flex flex-col">
                          <Input
                            {...field}
                            className={`border w-full ${error ? 'border-red-500' : 'border-[rgb(var(--lb-blue-200))]'
                              }`}
                            type="tel"
                            maxLength={6}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            disabled={!emailSubmitted || isOtpLoading}
                          />

                          {error && (
                            <p className="text-red-500 text-sm mt-1 break-words">
                              {error?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />

              </div>
              {isTimerActive && (
                <div className="text-md font-medium text-green-500 w-fit rounded-xl mt-2">
                  OTP expires in:{' '}
                  {String(Math.floor(timer / 60)).padStart(2, '0')}:
                  {String(timer % 60).padStart(2, '0')}
                </div>
              )}
            </div>

            <div className="mt-0 p-4 flex justify-between">
              <div className="text-[rgb(var(--lb-blue-250))] text-[13px]">
                If you don&apos;t receive the email, you can check it in spam
              </div>
              <Button
                loading={isOtpLoading}
                disabled={!emailSubmitted || isOtpLoading}
                type="submit"
                className="bg-green-500 py-2 text-white rounded hover:bg-green-600"
              >
                Submit
              </Button>
            </div>
          </form>
        </>
      )}
      <CustomToast
        showToast={showToast}
        setShowToast={setShowToast}
        message={message}
        status={status}
      />
    </section>
  );
};

export default Email;
