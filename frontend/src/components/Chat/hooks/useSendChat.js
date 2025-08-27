/* eslint-disable no-undef */
'use client';
import { toast } from '@/hooks/use-toast';
import { useStateContext } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GLOBAL_CHAT_ID } from "../constants"; 

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
    setIsGifOpen(!isGifOpen);
    setError('');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsGifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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
    setIsGifOpen(false);
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
        message,
        isprivate: false,
        messageType: isGif ? "GIF" : "MESSAGE",
        userId: user?.userId,
        groupId: GLOBAL_CHAT_ID,
        user: user,
      };




      sendMessage(payload, 'SEND_MESSAGE');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('new-local-message', { detail: payload })
        );
      }

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
