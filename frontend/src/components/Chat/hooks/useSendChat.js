/* eslint-disable no-undef */

import { toast } from '@/hooks/use-toast';
import { useStateContext } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const useSendChat = ({ sendMessage }) => {
  const {
    state: { user },
  } = useStateContext();
  const { control, handleSubmit, reset, setValue } = useForm();
  const textareaRef = useRef(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [error, setError] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isGifOpen, setIsGifOpen] = useState(false);
  const pickerRef = useRef(null);
  const handleGifClick = () => {
    // if (user?.wagered > 50 ) {
    setIsGifOpen(!isGifOpen);
    setError('');
    // } else {
    //   toast({
    //     description: 'Yor need wager over 50 SC to use the gif feature.',
    //     className:
    //       'fixed bottom-[110px] right-4 z-50 w-[55%] sm:w-[45%] md:w-[30%] text-black font-semibold border shadow-lg rounded-md p-4 bg-red-400 border-red-50',
    //   });
    // }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsGifOpen(!isGifOpen);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGifOpen]);
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 4 * parseFloat(getComputedStyle(textarea).lineHeight);
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  const handleEmojiSelect = (emoji) => {
    const emojiValue = emoji?.native;
    const textarea = textareaRef.current;

    if (textarea) {
      const cursorPosition = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPosition);
      const textAfter = textarea.value.substring(cursorPosition);
      const newValue = `${textBefore}${emojiValue}${textAfter}`;
      setValue('message', newValue);
      setCharacterCount(newValue.length);
      textarea.focus();

      if (newValue.length > 200) {
        setError('Message exceeds 200 characters.');
      } else {
        setError('');
      }
    }
  };

  const handleGifSelect = (gif) => {
    setError('');
    const gifValue = gif?.url;
    onSubmit({ message: gifValue, isGif: true });
    setIsGifOpen(!isGifOpen);
  };

  const onSubmit = async (data) => {
    const { message, isGif = false } = data;
    if (characterCount > 200) {
      setError('Message exceeds 200 characters.');
      return;
    }
    if (message.trim() === '') {
      setError('Message cannot be empty.');
      return;
    }
    if (user?.email) {
      const payload = {
        message: message,
        isprivate: false,
        messageType: isGif ? 'GIF' : 'MESSAGE',
      };
      sendMessage(payload, 'SEND_MESSAGE');
      reset();
      setCharacterCount(0);
      setError('');
    } else {
      toast({
        description: 'You need verify email to speak in the chatroom.',
        className:
          'fixed bottom-[110px] right-4 z-50 w-[55%] sm:w-[45%] md:w-[30%] text-black font-semibold border shadow-lg rounded-md p-4 bg-red-400 border-red-50',
      });
    }
  };

  const handleInputChange = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const currentLength = textarea.value.length;
      setCharacterCount(currentLength);
      if (currentLength > 200) {
        setError('Message exceeds 200 characters.');
      } else {
        setError('');
      }
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    autoResizeTextarea,
    textareaRef,
    handleEmojiSelect,
    characterCount,
    error,
    handleInputChange,
    isPickerOpen,
    setIsPickerOpen,
    isGifOpen,
    setIsGifOpen,
    handleGifSelect,
    pickerRef,
    handleGifClick,
  };
};

export default useSendChat;
