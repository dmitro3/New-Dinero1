import { cross, playId } from '@/assets/svg';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getDateTime, truncateDecimals } from '@/lib/utils';
import { useStateContext } from '@/store';
import { DialogTitle } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const GameDialog = ({ isOpen, handleClick, gamePlayData = {} }) => {
  const {
    created_at = new Date(),
    game_name,
    // game_round_id,
    gameid,
    thumbnail_url,
    total_bet_amount,
    total_win_amount,
    // user_id,
    username,
    // win_difference,
    // profileimage,
  } = gamePlayData || {};
  const router = useRouter();

  const multiplier =
    total_bet_amount > 0
      ? truncateDecimals(total_win_amount / total_bet_amount, 2)
      : 0;
  const total =
    total_bet_amount > 0
      ? truncateDecimals(multiplier * total_bet_amount, 2)
      : 0;
  const {
    state: { user },
  } = useStateContext();
  const onclick = () => {
    if (user?.email) {
      router.push(`/game-play/${gameid}`);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClick} className="border-none">
      <DialogContent className="max-w-lg  max-h-[420] mx-auto mb-6 rounded-lg bg-[hsl(var(--main-background))] shadow-lg border-none">
        <DialogHeader className="flex flex-row justify-between max-h-8">
          <div className="flex justify-center items-center space-x-2">
            <Image src={playId} alt="sotre image" />
            <DialogTitle className="text-white">Play ID</DialogTitle>
          </div>
          <div className="flex">
            <Image
              src={cross}
              alt="close icon"
              onClick={handleClick}
              className="invert hover:bg-gray-500 rounded-xl"
            />
          </div>
        </DialogHeader>
        <div className="w-full flex flex-col justify-center items-center space-y-4 text-white">
          <div className="flex  justify-between w-full">
            <Image
              src={thumbnail_url}
              alt={game_name}
              width={114}
              height={114}
              className="rounded-lg w-[70px] h-[70px]  sm:w-[114px] sm:h-[114px] object-cover"
            />
            <div className="ml-4 flex flex-col justify-between w-full">
              <div className="flex justify-between mb-1">
                <p className="font-bold text-sm sm:text-lg">{game_name}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onclick}
                      className="bg-[rgb(var(--lb-blue-900))] hover:bg-[rgb(var(--lb-blue-400))] rounded-md font-bold sm:text-base p-1 px-2 sm:py-5 shadow-sm"
                    >
                      Play Now
                    </Button>
                  </TooltipTrigger>
                  {!user?.email && (
                    <TooltipContent
                      side="top"
                      className="z-[99999] text-white font-semibold border shadow-lg rounded-md p-4 mx-auto flex justify-center items-center "
                    >
                      <p>Hey, verify your email first to play!</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
              <div className="p-1 sm:p-4 bg-[rgb(var(--lb-blue-800))] rounded-md text-sm mr-1 sm:mr-0 ">
                <p className="font-bold ">Play ID: {gameid}</p>
                <p className="text-blue-300">Played By {username}</p>
                <p className="text-blue-300">On {getDateTime(created_at)}</p>
              </div>
            </div>
          </div>
          <div className="bg-[rgb(var(--lb-blue-800))] w-full rounded-md p-4">
            <div className="text-3xl text-center text-green-400 font-bold">
              {total || 0} SC
            </div>
            <div className="bg-[rgb(var(--lb-blue-600))] flex justify-between items-center p-3 mt-3 rounded-md">
              <div className="text-center flex-1 border-r border-[rgb(var(--lb-blue-100))]">
                <p className="text-blue-300">Played (SC)</p>
                <p className="font-bold">
                  {truncateDecimals(total_bet_amount, 2) || 0} SC
                </p>
              </div>
              <div className="text-center flex-1">
                <p className="text-blue-300">Multiplier</p>
                <p className="font-bold">{multiplier || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameDialog;
