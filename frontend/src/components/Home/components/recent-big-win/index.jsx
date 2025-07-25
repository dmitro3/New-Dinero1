'use client';
import { CardContent } from '@/components/ui/card';
import Image from 'next/image';
import useRecentBigWin from '../../hooks/useRecentBigWin';
import GameDialog from '../game-dialog';
import style from '../style.module.scss';

const RecentBigWin = () => {
  const {
    scrollRef,
    isOpen,
    setIsOpen,
    gameplayData,
    handleOnClick,
    // loading,
    formatedData = [],
  } = useRecentBigWin();

  // const renderLoading = () => {
  //   return (
  //     <HomeCustomCardSkeleton
  //       className=" w-[89px] h-[106px] md:w-[99px] md:h-[116px] lg:w-[99px] lg:h-[116px] xl:w-[99px] xl:h-[116px]"
  //       rows={9}
  //     />
  //   );
  // };

  return (
    <>
      <div className="flex items-center space-x-2 mb-2">
        <div className="relative">
          <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <h2 className="text-white  text-sm sm:text-lg font-bold">
          Recent Big Wins
        </h2>
      </div>
      {/* {loading ? (
        renderLoading()
      ) : ( */}
      <div
        ref={scrollRef}
        className={`w-full overflow-x-auto whitespace-nowrap scrollbar-hide ${style.scrollbarcontainer}`}
      >
        <div className="flex">
          {formatedData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center text-white hover:scale-110 transition-transform duration-300 ease-in-out"
            >
              <CardContent className="p-0 w-[89px] md:w-[99px]">
                <Image
                  onClick={() => handleOnClick(item)}
                  src={item?.thumbnail_url}
                  width={80}
                  height={80}
                  alt={item?.game_name}
                  className="w-[80px] md:w-[90px] h-[80px] md:h-[90px] rounded-lg cursor-pointer"
                />
              </CardContent>
              <div className="">
                <p className="text-white text-sm mt-2 truncate w-full flex justify-center">
                  {item?.username}
                </p>
                <p className="text-green-400 font-bold text-sm flex justify-center w-full">
                  {item?.total_win_amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* )} */}
      {isOpen && (
        <GameDialog
          isOpen={isOpen}
          handleClick={() => setIsOpen(!isOpen)}
          gamePlayData={gameplayData}
        />
      )}
    </>
  );
};

export default RecentBigWin;
