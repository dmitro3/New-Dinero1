'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useVip = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [active, setActive] = useState('progress');
    const {t} =useTranslation();

    const handleClose = () => {
        setIsOpen((prev) => !prev);
    };
    return {
        isOpen,
        handleClose,
        active,
        setActive,
        t
    };
};

export default useVip;