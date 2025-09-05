'use client';
import React, { useRef, useState, useEffect } from 'react';
import useGamePlay from '../hook/useGamePlay';
import GamePlayBottom from './game-play-bottom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home } from 'lucide-react';
import Image from 'next/image';
import { maximize, minimize } from '@/assets/svg';

const GamePlay = () => {
  const gamePlayRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // ✅ Fix Safari viewport height issues (address bar hiding on rotate)
  useEffect(() => {
    const setVh = () => {
      const vh = (window.visualViewport?.height || window.innerHeight) * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();

    window.visualViewport?.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.visualViewport?.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  // More robust mobile detection
  const isMobile = (typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) || window.innerWidth <= 768;

  const {
    gamePlayData,
    isGameTypeSelected,
    handleIsDemo,
    isDemo,
    isLoading,
    error,
  } = useGamePlay();

  const { gameLauchUrl, isFavourite } = gamePlayData || {};

  // Fullscreen helpers
  const enterFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
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

  // Auto-start game (mobile)
  useEffect(() => {
    if (!isLoading && !error && gameLauchUrl) {
      if (isMobile) {
        setIsFullScreen(true);
        const element = document.documentElement;
        if (element) {
          enterFullscreen(element);

          // ✅ Force Safari to hide bars on rotate
          setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.style.height = '100%';
            document.body.style.height = '100%';
            const vh = (window.visualViewport?.height || window.innerHeight) * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
          }, 200);
        }
      }
      setGameStarted(true);
      handleIsDemo(false);
    }
  }, [isLoading, error, gameLauchUrl, isMobile]);

  // Ensure fullscreen is maintained on orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isMobile && gameStarted && !isFullscreenActive()) {
        const element = document.documentElement;
        if (element) {
          enterFullscreen(element);
          setIsFullScreen(true);
        }
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile, gameStarted]);

  // Sync fullscreen state
  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!isFullscreenActive());
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

  const toggleFullscreen = () => {
    const element = gamePlayRef.current?.parentElement;
    if (!isFullScreen && element) {
      enterFullscreen(element);
      setIsFullScreen(true);

      if (isMobile) {
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.style.height = '100%';
          document.body.style.height = '100%';
        }, 200);
      }
    } else {
      exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div
      className={`bg-[hsl(var(--main-background))] ${
        isFullScreen ? 'fixed inset-0 z-[9999]' : ''
      }`}
    >
      <div
        className={`relative w-full ${
          isFullScreen
            ? 'h-[100dvh] h-[calc(var(--vh)*100)]'
            : 'h-[calc(var(--vh)*90)] md:h-[calc(var(--vh)*87)]'
        } bg-gray-800`}
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
            className={`border-none w-full h-full ${
              !isGameTypeSelected && 'blur-sm'
            }`}
          ></iframe>
        )}

        {/* ✅ Home + Fullscreen buttons */}
        {gameStarted && (
          <div className="absolute top-4 left-4 flex flex-col gap-3 z-[10000]">
            {/* Home button */}
            <button
              className="bg-[#811af0] hover:bg-white hover:text-[#811af0] text-white p-3 rounded-full shadow-lg"
              onClick={() => {
                exitFullscreen();
                setIsFullScreen(false);
                setGameStarted(false);
                window.location.href = '/';
              }}
            >
              <Home className="w-6 h-6" />
            </button>

            {/* Fullscreen toggle button */}
            <button
              className="bg-[#811af0] hover:bg-white hover:text-[#811af0] text-white p-3 rounded-full shadow-lg flex items-center justify-center"
              onClick={toggleFullscreen}
            >
              <Image
                src={isFullScreen ? minimize : maximize}
                alt="fullscreen-toggle"
                width={24}
                height={24}
              />
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
