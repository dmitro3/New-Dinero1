'use client';
import { maximize, minimize } from '@/assets/svg'; // ✅ removed heart imports
import Image from 'next/image';
import useBottom from '../../hook/useBottom';
// import LiveStatusModal from '../live-status-modal';

const GamePlayBottom = ({ gamePlayRef, handleIsDemo, isDemo }) => {
  const {
    // isModalOpen,
    // setModalOpen,
    toggleFullscreen,
    isFullscreen,
  } = useBottom(gamePlayRef);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg h-[63]">
      <div className="flex gap-5">
        {/* ✅ Only fullscreen toggle remains */}
        <Image
          src={isFullscreen ? minimize : maximize}
          alt="fullscreen-toggle"
          height={20}
          width={20}
          className="cursor-pointer"
          onClick={toggleFullscreen}
        />
      </div>

      {/* Demo/Real Play toggle still here if you want to enable it later */}
      {/* 
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-bold ${
            isDemo ? 'text-green-400' : 'text-[rgb(var(--lb-blue-200))]'
          }`}
        >
          Fun Play
        </span>
        <div
          className="relative w-12 h-5 rounded-full cursor-pointer transition-all duration-300 bg-[rgb(var(--lb-blue-600))]"
          onClick={() => {
            handleIsDemo(!isDemo);
          }}
        >
          <div
            className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${
              !isDemo ? 'translate-x-7' : 'translate-x-0'
            }`}
          ></div>
        </div>
        <span
          className={`text-sm font-bold ${
            !isDemo ? 'text-green-400' : 'text-[rgb(var(--lb-blue-200))]'
          }`}
        >
          Real Play
        </span>
      </div> 
      */}
    </div>
  );
};

export default GamePlayBottom;
