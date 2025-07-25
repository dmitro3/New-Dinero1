import { vipBronze } from '@/assets/png';
import { info } from '@/assets/svg';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { isEmpty } from '@/lib/utils';
import { useStateContext } from '@/store';
import Image from 'next/image';
import { PROGRESS_FIELDS, REWARDS } from '../../constant';

const VipLevelsCards = ({ vipData }) => {
  const { name, rewards, level } = vipData;
  const {
    state: { rightPanel },
  } = useStateContext();

  return (
    <Card
      className={`flex flex-col items-center h-[230px] bg-gradient-to-b from-[var(--gradient-end)] to-[var(--gradient-start)] border-none 
      aspect-[3/4] shadow-md hover:shadow-yellow-300/60 transition-shadow duration-300 w-[calc(50%-6px)] sm:w-[calc(33.33%-6px)]
      ${
        rightPanel
          ? 'md:w-[calc(25%-6px)] lg:w-[calc(19.8%-6px)] xl:w-[calc(16.6%-6px)]'
          : 'md:w-[calc(25%-6px)] lg:w-[calc(33.33%-6px)] xl:w-[calc(25%-6px)]'
      } p-4 rounded-lg`}
    >
      <div className="relative w-full flex justify-center mb-4">
        <Image
          src={vipBronze}
          alt="VIP Icon"
          width={100}
          height={100}
          className="rounded-full border-4 border-yellow-500 shadow-lg"
        />
        <span className="absolute -bottom-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Level {level}
        </span>
      </div>

      <div className="text-white text-sm mb-4 space text-start font-semibold">
        <h1 className="text-lg font-bold text-center">{name}</h1>
      </div>
      <div className="flex gap-2">
        <Popover className="border-none mt-auto">
          <PopoverTrigger asChild>
            <Button
              disabled={isEmpty(vipData?.rewards)}
              className="w-[85%] py-2 bg-green-400  text-blue-950 hover:bg-blue-600 hover:text-white transition-colors"
            >
              {isEmpty(vipData?.rewards) ? 'No Rewards' : 'Show Rewards'}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="max-w-[280px] bg-gradient-to-b from-gray-800 to-gray-900 p-5 rounded-xl shadow-2xl border border-[var(--progress-bar)]">
            <h2 className="text-xl text-yellow-400 font-extrabold mb-4 text-center uppercase tracking-wide">
              Rewards
            </h2>

            <ul className="text-gray-300 text-sm space-y-4">
              {rewards.map((reward) => (
                <li
                  key={reward?.rewardId}
                  className="bg-[hsl(var(--background))] rounded-lg p-3 border border-gray-600 shadow-md hover:shadow-lg transition-shadow"
                >
                  {REWARDS.map((field, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mb-2"
                    >
                      <span className="text-yellow-400 font-semibold">
                        {field.name} :
                      </span>
                      <span>{reward[field.value]}</span>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <Popover className="border-none mt-auto">
          <PopoverTrigger asChild>
            <Image src={info} alt="info icon" />
          </PopoverTrigger>

          <PopoverContent className="max-w-[280px] bg-gradient-to-b from-gray-800 to-gray-900 p-5 rounded-xl shadow-2xl border border-[var(--progress-bar)]">
            <h2 className="text-xl text-yellow-400 font-extrabold mb-4 text-center uppercase tracking-wide">
              Details
            </h2>

            <ul className="text-gray-300 text-sm space-y-4">
              <li className="bg-[hsl(var(--background))] rounded-lg p-3 border border-gray-600 shadow-md hover:shadow-lg transition-shadow">
                {PROGRESS_FIELDS.map((field, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-yellow-400 font-semibold">
                      {field.name} :
                    </span>
                    <span>{vipData[field.value]}</span>
                  </div>
                ))}
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
};

export default VipLevelsCards;
