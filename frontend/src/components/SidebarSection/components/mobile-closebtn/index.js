import { closeIconWhite } from '@/assets/svg';
import { useStateContext } from '@/store';
import Image from 'next/image';
import React from 'react';

const MobileCloseButton = () => {
  const { state, dispatch } = useStateContext();

  return (
    <div
      className="flex justify-end relative bg-transparent shadow-none text-white p-2 mt-2 hover:bg-transparent"
      onClick={() =>
        dispatch({
          type: 'SET_LEFT_PANEL',
          payload: !state.leftPanel,
        })
      }
    >
      {
        <>
          <Image width={20} height={20} src={closeIconWhite} alt="close-icon" />
        </>
      }
    </div>
  );
};

export default MobileCloseButton;
