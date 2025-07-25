'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function useProfile() {
  const { t } = useTranslation();
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');
  const handleClick = (value) => {
    setIsOpen(!isOpen);
    setActiveUrl(value);
  };

  const handleProfileSection = (page, button) => {
    if (page) {
      if (button) {
        handleClick(page);
      } else {
        push(`/${page}`);
      }
    }
  };
  return {
    handleProfileSection,
    t,
    push,
    isOpen,
    activeUrl,
    handleClick
  };
}

export default useProfile;