import { useState } from 'react';

const useChatNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('');
  const [buttonType, setButtonType] = useState('');
  const handleClick = (value, buttonType) => {
    setIsOpen(!isOpen);
    setActive(value);
    setButtonType(buttonType);
  };
  return { handleClick, active, isOpen, buttonType };
};

export default useChatNav;
