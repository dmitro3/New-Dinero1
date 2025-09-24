'use client';
import { eye, eyeOff, message } from '@/assets/svg';
import { ELEMENT } from '@/common/form-control';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import useUserAuth from '../hooks/useUserAuth';
import useForgotPassword from '../hooks/useForgotPassword';
import CustomDialog from '../TermsPrivacy';
import useTermsPrivacy from '../TermsPrivacy/hooks/useTermsPrivacy';
import { useEffect, useState } from 'react';
import { FORGOT_PASSWORD } from '../constant';

const UserForm = ({
  controls,
  isSignUp = false,
  setOpen,
  setIsForgotPassword,
  isForgotPassword = false,
  setToastState,
  geoInfo,
  isBlocked = false,
}) => {
  // Use useForm to get control, handleSubmit, watch
  const { control, handleSubmit, watch } = useForm();

  // Use hooks for auth and forgot password but do not destructure control/handleSubmit from them
  const authHook = useUserAuth({ setOpen, isSignUp, setToastState });
  const forgotPasswordHook = useForgotPassword({
    setIsForgotPassword,
    setToastState,
  });

  // Use originalOnSubmit, loading, showPassword, togglePasswordVisibility from hooks
  const {
    onSubmit: originalOnSubmit,
    loading = false,
    showPassword = false,
    togglePasswordVisibility = () => {},
  } = isForgotPassword ? forgotPasswordHook : authHook;

  const [isMarkTick, setIsMarkTick] = useState(false);

  // Use local state for checkboxes to track acceptance
  const [isAgeChecked, setIsAgeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  useEffect(() => {
    setIsMarkTick(!!isAgeChecked && !!termsChecked);
  }, [isAgeChecked, termsChecked]);

  const onSubmit = (data) => {
    if (isSignUp) {
      if (!data.isAge || !data.terms) {
        setToastState &&
          setToastState({
            showToast: true,
            message:
              'Please allow the Terms of Use, Privacy Policy, and Age/State restriction.',
            status: 'error',
          });
        return;
      }
    }

    if (isBlocked) {
      setToastState &&
        setToastState({
          showToast: true,
          message: 'Access from your region is not allowed.',
          status: 'error',
        });
      return;
    }
    originalOnSubmit(data);
  };

  const {
    termsData,
    privacyData,
    fetchTerms,
    fetchPrivacyPolicy,
    termsPrivacyLoading,
  } = useTermsPrivacy();

  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    type: null,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between flex-grow"
    >
      {controls?.map((item) => {
        const Component = ELEMENT[item.type];
        const isCheckbox = item.type === 'checkbox';
        const isPassword = item.name === 'password';

        return (
          <Controller
            key={item.name}
            control={control}
            name={item.name}
            rules={
              isSignUp && (item.name === 'username' || item.name === 'password')
                ? {
                    required: item.required,
                    pattern: item.pattern,
                  }
                : {
                    required: item.required,
                    pattern: item.pattern,
                  }
            }
            render={({ field, fieldState }) => {
              const error = fieldState?.error;
              return (
                <div className="text-left flex flex-col">
                  {!isCheckbox && (
                    <label className="text-blue-100 tw-font-bold">
                      {item.label}
                    </label>
                  )}
                  <div className="items-center space-x-2 mt-2 relative">
                    <div
                      className={`${
                        error ? 'border-red-500' : 'border-gray-300'
                      } transition-colors duration-200`}
                    >
                      {isPassword ? (
                        <div className="relative w-full">
                          <Component
                            type={showPassword ? 'text' : 'password'}
                            placeholder={item.placeholder}
                            {...field}
                            className={`w-full ${error && 'border-red-500'} focus:bg-transparent`}
                          />
                          <div
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          >
                            {showPassword ? (
                              <Image src={eyeOff} alt="eye-off" />
                            ) : (
                              <Image src={eye} alt="eye" />
                            )}
                          </div>
                        </div>
                      ) : isCheckbox ? (
                        <div className="!w-full flex flex-row gap-2">
                          <Component
                            placeholder={item.placeholder}
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (item.name === 'isAge')
                                setIsAgeChecked(checked);
                              if (item.name === 'terms')
                                setTermsChecked(checked);
                            }}
                            name={item.name}
                            {...field}
                            className={`mt-0.5 ${error && 'border-red-500'}`}
                          />
                          <label className="font-size-6 sm:font-size-10 text-xs sm:text-sm text-blue-300 leading-4">
                            {item.isLink ? (
                              <>
                                <span>I accept the </span>
                                {item.label.includes('Terms of Use') && (
                                  <span
                                    className="cursor-pointer underline text-blue-500"
                                    onClick={() => {
                                      setDialogConfig({
                                        isOpen: true,
                                        type: 'terms',
                                      });
                                      fetchTerms();
                                    }}
                                  >
                                    Terms of Use
                                  </span>
                                )}
                                {item.label.includes('Terms of Use') &&
                                  item.label.includes('Privacy Policy') &&
                                  ' and '}
                                {item.label.includes('Privacy Policy') && (
                                  <span
                                    className="cursor-pointer underline text-blue-500"
                                    onClick={() => {
                                      setDialogConfig({
                                        isOpen: true,
                                        type: 'privacy',
                                      });
                                      fetchPrivacyPolicy();
                                    }}
                                  >
                                    Privacy Policy
                                  </span>
                                )}
                              </>
                            ) : (
                              item.label
                            )}
                          </label>
                        </div>
                      ) : (
                        <Component
                          placeholder={item.placeholder}
                          {...field}
                          className={`${error && 'border-red-500'}`}
                        />
                      )}
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-500 mt-0.5 text-xs sm:text-sm transition-opacity duration-300 ease-in-out opacity-100 translate-y-0">
                      {error.message}
                    </div>
                  )}
                </div>
              );
            }}
          />
        );
      })}

      {!isSignUp && !isForgotPassword && (
        <div className="text-left mt-2">
          <span
            className="text-blue-400 text-sm cursor-pointer inline-block"
            onClick={() => setIsForgotPassword(true)}
          >
            Forgot Password?
          </span>
        </div>
      )}

      {isForgotPassword ? (
        <div className="flex justify-between gap-4 pt-6 mt-auto">
          <Button
            type="button"
            className="w-[50%] border bg-transparent text-white"
            onClick={() => setIsForgotPassword(false)}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[50%] bg-green-500 text-white rounded hover:bg-green-600"
            loading={loading}
            disabled={loading || isBlocked}
          >
            Reset Password
          </Button>
        </div>
      ) : (
        <>
          <Button
            type="submit"
            className="w-full bg-green-500 py-2 !mt-10 text-white rounded hover:bg-green-600"
            loading={loading}
            disabled={loading || isBlocked}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          <Button
            type="button"
            disabled={isBlocked || (isSignUp && !isMarkTick)}
            className="w-full border border-gray-300 bg-white text-black flex items-center justify-center gap-1 mt-4 hover:bg-gray-100"
            onClick={() => {
              if (isBlocked) {
                setToastState?.({
                  showToast: true,
                  message: 'Access from your region is not allowed.',
                  status: 'error',
                });
                return;
              }
              if (isSignUp && !isMarkTick) {
                setToastState?.({
                  showToast: true,
                  message:
                    'Please accept Terms of Use, Privacy Policy, and Age/State restriction.',
                  status: 'error',
                });
                return;
              }
              window.location.href =
                process.env.NEXT_PUBLIC_BACKEND_URL + '/api/v1/auth/sso/google';
            }}
          >
            <span>
              {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
            </span>
          </Button>

          <Button
            type="button"
            disabled={isBlocked || (isSignUp && !isMarkTick)}
            className="w-full border border-blue-600 bg-white text-black flex items-center justify-center gap-1 mt-2 hover:bg-blue-50"
            onClick={() => {
              if (isBlocked) {
                setToastState?.({
                  showToast: true,
                  message: 'Access from your region is not allowed.',
                  status: 'error',
                });
                return;
              }
              if (isSignUp && !isMarkTick) {
                setToastState?.({
                  showToast: true,
                  message:
                    'Please accept Terms of Use, Privacy Policy, and Age/State restriction.',
                  status: 'error',
                });
                return;
              }
              window.location.href =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                '/api/v1/auth/sso/facebook';
            }}
          >
            <span>
              {isSignUp ? 'Sign up with Facebook' : 'Sign in with Facebook'}
            </span>
          </Button>
        </>
      )}

      <CustomDialog
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig({ isOpen: false, type: null })}
        type={dialogConfig.type}
        loading={termsPrivacyLoading}
        data={dialogConfig.type === 'terms' ? termsData : privacyData}
      />
    </form>
  );
};

export default UserForm;
