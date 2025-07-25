'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

function Logo() {
  const { push } = useRouter();

  return (
    <div
      className="text-white font-bold shiny-hover cursor-pointer"
      onClick={() => push('/')}
    >
      <Image
        style={{ filter: 'drop-shadow(0px 0px 3px black)' }}
        src="/logo.png"
        alt="company-logo"
        height={10}
        width={150}
        className="h-[60px] sm:h-[70px] md:h-[75px] w-auto object-contain transition-transform duration-500 hover:rotate-12"
      />
    </div>
  );
}

export default Logo;
