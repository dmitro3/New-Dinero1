'use client';
import React from 'react';
import useTimer from '../../hook/useTimer';

const Timer = ({ initialTime, setActive }) => {
  const { minutes, seconds } = useTimer(initialTime, setActive);

  return (
    <div className="flex  justify-center text-white text-3xl space-x-2">
      <div>
        <div className="bg-[rgb(var(--lb-blue-900))] p-2 rounded-md w-12 text-center">
          {minutes}
        </div>
        <span className="text-sm">Minutes</span>
      </div>
      <span className="text-3xl">:</span>
      <div>
        <div className="bg-[rgb(var(--lb-blue-900))] p-2 rounded-md w-12 text-center">
          {seconds}
        </div>
        <span className="text-sm">Seconds</span>
      </div>
    </div>
  );
};

export default Timer;
