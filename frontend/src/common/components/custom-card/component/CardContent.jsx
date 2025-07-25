'use client';

import { defaultGameImage } from '@/assets/png';
import { heart, heartLike, play } from '@/assets/svg';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useStateContext } from '@/store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './CustomCardStyle.scss';

export default function CardContent({
  iconUrl,
  handleFavoriteGame,
  casinoGameId,
  id,
  isFavorite,
  hideFavorite,
  isHomeScreen,
}) {
  const getThumbnailUrl = (url) => {
    if (!url || url === '{}') {
      return defaultGameImage;
    }
    return url;
  };

  const route = useRouter();
  const {
    state: { user },
  } = useStateContext();

  const [isMobile, setIsMobile] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onclick = () => {
    if (user?.email) {
      route.push(`/game-play/${id}`);
    } else if (isMobile) {
      setTooltipOpen(true);
      setTimeout(() => {
        setTooltipOpen(false);
      }, 3000); // Keep tooltip visible for 3 seconds
    }
  };

  return (
    <div className={`game-card ${isHomeScreen ? 'home-screen' : ''}`}>
      <div className="game-card-body">
        <div className="game-img-wrap">
          <Image
            width={10000}
            height={10000}
            src={getThumbnailUrl(iconUrl)}
            alt="Game Img"
            key={id}
            className="blured-bg-img"
          />
        </div>
      </div>

      <div className="game-card-overlay">
        {!hideFavorite && (
          <button
            className="favorite-btn"
            onClick={() => handleFavoriteGame(casinoGameId || id)}
          >
            {isFavorite ? (
              <Image src={heartLike} alt="Favorite" />
            ) : (
              <Image src={heart} alt="Not Favorite" />
            )}
          </button>
        )}

        <Tooltip open={isMobile ? tooltipOpen : undefined}>
          <TooltipTrigger asChild>
            <Button type="button" className="play-btn" onClick={onclick}>
              <Image src={play} width={30} alt="Play Icon" />
            </Button>
          </TooltipTrigger>
          {!user?.email && (
            <TooltipContent
              side="top"
              className="z-[99999] text-white font-semibold border shadow-lg rounded-md p-4 mx-auto flex flex-col justify-center items-center"
            >
              <p className="mb-2">Hey, please verify your email first to play!</p>
              <Link href="/setting?active=email" className="text-blue-400">
                Click here to verify email
              </Link>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}

