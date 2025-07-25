'use client';

import { useState } from 'react';

const useLiveSupport = () => {
    const [isOpen, setIsOpen] = useState(true);

    const [currentTab, setCurrentTab] = useState('home');

    const handleClose = () => {
        setIsOpen((prev) => !prev);
    };
    const handleOtionClick =(item)=>{
        setCurrentTab(item);
    };
    return {
        isOpen,
        handleClose,
        currentTab,
        handleOtionClick

    };
};

export default useLiveSupport;