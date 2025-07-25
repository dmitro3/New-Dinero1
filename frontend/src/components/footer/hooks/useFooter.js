'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useFooter = () => {
  const [isGamePlay, setIsGamePlay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname();
  const route = useRouter();
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleOpenTerms = () => {
    route.push('/general-terms');
  };
  useEffect(() => {
    if (pathname.includes('game-play')) {
      setIsGamePlay(true);
    } else {
      setIsGamePlay(false);
    }
  }, [pathname]);
  return { isGamePlay, t, handleClick, isOpen, handleOpenTerms };
};

export default useFooter;
