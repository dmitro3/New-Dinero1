import Image from 'next/image';
import React from 'react';

const CoinBadge = ({ icon, value }) => {
  return (
    <div className="flex  gap-[0.2rem]">
      <Image src={icon} alt="gc-coin" width="13" height="13" />
      <span className="text-xs text-green-400">{value}</span>
    </div>
  );
};

export default CoinBadge;
