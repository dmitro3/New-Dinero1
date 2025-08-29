'use client';
import React, { useRef, useState, useEffect } from 'react';
import useGamePlay from '../hook/useGamePlay';
import GamePlayBottom from './game-play-bottom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home } from 'lucide-react';

const GamePlay = () => {
  const gamePlayRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // ✅ track game start

  const isMobile = useIsMobile();

  const {
    gamePlayData,
    isGameTypeSelected,
    handleIsDemo,
    isDemo,
    isLoading,
    error,
  } = useGamePlay();

  const { gameLauchUrl, isFavourite } = gamePlayData || {};

  // 🔹 Fullscreen helpers
  const enterFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen(); // Firefox
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE/Edge
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const isFullscreenActive = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  // 🔹 Auto-start the game (instead of waiting for Play button)
  useEffect(() => {
    if (!isLoading && !error && gameLauchUrl) {
      if (isMobile) {
        setIsFullScreen(true);
        const element = gamePlayRef.current?.parentElement;
        if (element) enterFullscreen(element);
      }
      setGameStarted(true);
      handleIsDemo(false);
    }
  }, [isLoading, error, gameLauchUrl]);

  // 🔹 Sync fullscreen state if user exits manually
  useEffect(() => {
    const onFullScreenChange = () => {
      if (!isFullscreenActive()) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', onFullScreenChange);
    document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    document.addEventListener('mozfullscreenchange', onFullScreenChange);
    document.addEventListener('MSFullscreenChange', onFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
      document.removeEventListener('mozfullscreenchange', onFullScreenChange);
      document.removeEventListener('MSFullscreenChange', onFullScreenChange);
    };
  }, []);

  return (
    <div className={`bg-[hsl(var(--main-background))] ${isFullScreen ? 'fixed inset-0 z-[9999]' : ''}`}>
      <div
        className={`relative w-full ${isFullScreen ? 'h-screen' : 'h-[90vh] md:h-[87vh]'} bg-gray-800`}
        ref={gamePlayRef}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="relative w-16 h-16">
              <div className="w-full h-full border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500 text-lg font-semibold">{error}</p>
          </div>
        ) : (
          <iframe
            allowFullScreen
            referrerPolicy="no-referrer"
            src={gameLauchUrl}
            title="game-play"
            className={`border-none w-full h-full ${!isGameTypeSelected && 'blur-sm'}`}
          ></iframe>
        )}

        {/* ✅ Home icon: only show after game starts */}
        {gameStarted && (
          <div className="absolute top-4 left-4 z-[10000]">
            <button
              className="bg-[#811af0] hover:bg-white hover:text-[#811af0] text-white p-3 rounded-full shadow-lg"
              onClick={() => {
                exitFullscreen();
                setIsFullScreen(false);
                setGameStarted(false);
                window.location.href = '/'; // redirect to home
              }}
            >
              <Home className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom bar only if not fullscreen */}
      {!isFullScreen && isGameTypeSelected && (
        <GamePlayBottom
          gamePlayRef={gamePlayRef}
          handleIsDemo={handleIsDemo}
          isDemo={isDemo}
          isFavourite={isFavourite}
        />
      )}
    </div>
  );
};

export default GamePlay;
