import dynamic from 'next/dynamic';
import React from 'react';

const GamePlay = dynamic(() => import('@/components/game-play/components'));

const Page = () => {
  return <GamePlay />;
};

export default Page;
