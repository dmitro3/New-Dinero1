/* eslint-disable no-undef */
'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useStateContext } from '@/store';
import Image from 'next/image';
import { doubleRight } from '@/assets/svg';
import { useEffect, useState } from 'react';
function FloatElements() {
  const { state, dispatch } = useStateContext();
  const [sidebarWidth, setSidebarWidth] = useState('22rem');

  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth(
        window.innerWidth >= 2400
          ? '32rem'
          : window.innerWidth >= 2200
            ? '30rem'
            : window.innerWidth >= 2000
              ? '28rem'
              : window.innerWidth >= 1800
                ? '26rem'
                : window.innerWidth >= 1600
                  ? '24rem'
                  : '22rem'
      );
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="relative hidden md:block">
      <SidebarTrigger
        className="-ml-1 button-floating"
        style={{
          right: !state.rightPanel ? sidebarWidth : '1rem',
        }}
        side="right"
        onClick={() =>
          dispatch({ type: 'SET_RIGHT_PANEL', payload: !state.rightPanel })
        }
        icon={
          <Image
            src={doubleRight}
            className={state.rightPanel ? 'rotate-180' : ''}
            alt="logo"
          />
        }
      />
    </div>
  );
}

export default FloatElements;
