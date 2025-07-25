'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useSeed = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    handleClose,
    t,
  };
};

export default useSeed;
