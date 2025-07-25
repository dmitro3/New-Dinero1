'use client';
import useGetUserDeatil from '@/common/hook/useGetUserDeatil';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function useHeader() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');

  useGetUserDeatil();

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const [clickedButton, setClickedButton] = useState('');
  const handleButtonClick = (buttonType) => {
    setClickedButton(buttonType);
    handleClick();
    setActiveUrl(buttonType);
  };

  return {
    isOpen,
    t,
    clickedButton,
    handleButtonClick,
    handleClick,
    // userLoading,
    activeUrl,
  };
}

export default useHeader;
