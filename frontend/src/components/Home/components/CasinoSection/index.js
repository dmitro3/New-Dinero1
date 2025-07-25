'use client';
import { chevronLeft, chevronRight, gameIcon } from '@/assets/svg';
import Card from '@/common/components/custom-card/component';
import Image from 'next/image';
import useCasinoSection from '../../hooks/useCasinoSection';
import { useState } from 'react';

export default function CasinoSection({
  categoryId,
  categoryName,
  casinoGames,
}) {
  const [gameData, setGameData] = useState(casinoGames);
  const {
    emblaRef,
    scrollNext,
    scrollPrev,
    handleFavoriteGame,
    clickHandler,
  } = useCasinoSection({ setGameData });

  return (
    <div className="relative w-full mx-auto mt-2">
      <div className="flex justify-between items-center">
        <div className="flex shiny-hover text-white justify-start items-center bg-[rgb(var(--lb-blue-800))] p-2 md:px-3 rounded-[50px] m-2 relative font-extrabold text-[12px] sm:text-sm">
          <Image
            src={gameIcon}
            alt="category"
            className="mx-2 w-[18px] sm:w-[24px]"
          />
          {categoryName}
        </div>
        <div className="flex items-center gap-x-1 md:gap-x-2">
          <button
            onClick={() => clickHandler({ categoryId })}
            className="text-white font-bold text-[12px] sm:text-sm shiny-hover flex-center p-2 rounded-[50px] hover:bg-purple-900 bg-[rgb(var(--lb-blue-800))]"
          >
            Show All
          </button>
          <div className="flex bg-[rgb(var(--lb-blue-800))] rounded-[50px] text-center cursor-pointer">
            <button
              onClick={scrollPrev}
              //disabled={!canScrollPrev}
              className="flex-center w-8 md:w-11 border border-[hsl(var(--lb-blue-400))] p-2 rounded-l-[50px] opacity-30 hover:opacity-100 hover:text-white hover:bg-transparent cursor-default"
            >
              <Image src={chevronLeft} alt="left" />
            </button>

            <button
              onClick={scrollNext}
              //disabled={!canScrollNext}
              className="flex-center w-8 md:w-11 border border-[hsl(var(--lb-blue-400))] p-2 border-l-0 hover:opacity-100 text-blue-200 opacity-30 hover:text-white hover:bg-transparent rounded-r-[50px]"
            >
              <Image src={chevronRight} alt="right" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex space-x-2">
          {gameData?.map((game) => (
            <div
              key={`${game?.id}-${game?.casinoGameId}-${game?.casinoProviderId}`}
              className="min-w-[120px] md:min-w-[160px]"
            >
              <Card
                iconUrl={game?.thumbnailUrl}
                key={game?.id}
                handleFavoriteGame={() =>
                  handleFavoriteGame(game?.id, game?.isFavorite)
                }
                casinoGameId={game?.casinoGameId}
                isFavorite={game?.isFavorite}
                id={game?.id}
                isHomeScreen={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
