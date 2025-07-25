// import { vipChest } from '@/assets/png';
// import { spinWheel } from '@/assets/svg';
import CustomNoDataFound from '@/common/components/custom-noData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { isEmpty } from '@/lib/utils';
import useTaskList from '../../hooks/useTaskList';
// import CoinBadge from '../coin-badge';
import CustomCircularloading from '@/common/components/custom-circular-loading';

const Active = () => {
  const { activeTaskList,  loading, user } = useTaskList();
  if (loading) return <CustomCircularloading />;
  return (
    <div className="mt-3 w-full">
      {isEmpty(activeTaskList) && (
        <CustomNoDataFound
          className="h-[290px]"
          message="No Active Task Found!"
        />
      )}
      {activeTaskList?.map(({ id, label, task, remainingDays }) => (
        <Accordion key={id} type="single" collapsible className="mt-4">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="bg-[hsl(var(--side-bar-card))] text-white font-bold rounded px-3 py-2 hover:bg-blue-900 hover:no-underline">
              <div>
                <span>{label}</span>
                {/* <div className="flex gap-[0.7rem]">
                  {cashBonus && <CoinBadge icon={vipChest} value={cashBonus} />}
                  {freeSpin && <CoinBadge icon={spinWheel} value={freeSpin} />}
                </div> */}
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-[hsl(var(--foreground))] p-1">
              <div className="border-b pb-2 mb-4 mt-2 border-[rgb(var(--lb-blue-300))]">
                <div className="text-white font-bold text-sm">
                  Mission target:
                </div>
                <div className="mb-2">
                  {task && (
                    <p className="text-[rgb(var(--lb-blue-250))] text-[14px] mt-1 font-semibold">
                      {task}
                    </p>
                  )}
                </div>
              </div>
              {user?.userTierProgress[0]?.createdAt === undefined ||
              isNaN(remainingDays) ||
              remainingDays <= 0 ? (
                ''
              ) : (
                <div className="border-b pb-1 border-[rgb(var(--lb-blue-300))]">
                  <div className="text-white font-bold text-sm">
                    Remaining Days To Complete Task:
                  </div>
                  <div className="mb-2">
                    {task && (
                      <p className="text-[rgb(var(--lb-blue-250))] text-[14px] mt-1 font-semibold">
                        {remainingDays}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* <div>
                  <div className="text-white font-bold text-sm mt-2">
                    Mission rewards:
                  </div>
                  <div className="flex gap-3 mt-2">
                    {cashBonus && (
                      <div className="bg-black p-2 w-[40px] h-[40px] relative">
                        <Image
                          src={vipChest}
                          alt="cash-bonus"
                          width={20}
                          height={20}
                          className="m-auto"
                        />
                        <div className="w-full text-white text-[11px] font-bold bg-black/30 text-center absolute bottom-0 left-0">
                          {cashBonus}
                        </div>
                      </div>
                    )}
                    {freeSpin && (
                      <div className="bg-black p-2 w-[40px] h-[40px] relative">
                        <Image
                          src={spinWheel}
                          alt="free-spin"
                          width={20}
                          height={20}
                          className="m-auto"
                        />
                        <div className="w-full text-white text-[11px] font-bold bg-black/30 text-center absolute bottom-0 left-0">
                          {freeSpin}
                        </div>
                      </div>
                    )}
                  </div>
                </div> */}
              {/* <Button className="bg-green-400 hover:bg-green-300 w-full h-[40px] leading-[42px] cursor-pointer text-center text-blue-950 font-semibold rounded-[4px] mt-2">
                  Go Now
                </Button> */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default Active;
