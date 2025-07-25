import CustomNoDataFound from '@/common/components/custom-noData';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { isEmpty } from '@/lib/utils';
import useTaskList from '../../hooks/useTaskList';
import CoinBadge from '../coin-badge';
import CustomCircularloading from '@/common/components/custom-circular-loading';

const Claimed = () => {
  const { completedTaskList, loading } = useTaskList();
  if (loading) return <CustomCircularloading />;

  return (
    <div className="mt-3 w-full">
      {isEmpty(completedTaskList) && (
        <CustomNoDataFound
          className="h-[290px]"
          message="No Claimed Task Found!"
        />
      )}
      {completedTaskList?.map(({ id, label, value, icon }) => (
        <Accordion key={id} type="single" collapsible className="mt-4">
          <AccordionItem value="item-1" className="border-b-0">
            <div className="bg-[hsl(var(--side-bar-card))] text-white font-bold rounded px-3 py-2 hover:bg-blue-900 hover:no-underline">
              <div className="w-full flex justify-between items-center">
                <div>
                  <span>{label}</span>
                  <div className="flex gap-[0.7rem]">
                    {value && <CoinBadge icon={icon} value={value} />}
                  </div>
                </div>
                <div className="text-[rgb(var(--lb-blue-250))] font-medium">
                  CLAIMED
                </div>
              </div>
            </div>
            {/* <AccordionContent className="bg-[rgb(var(--lb-blue-900))] p-[1.5rem]">
                <div className="border-b pb-3 border-[rgb(var(--lb-blue-300))]">
                  <div className="text-white font-bold text-sm">
                    Mission target:
                  </div>
                  {missionTarget?.map(({ text, list = [] }, index) => (
                    <div key={`${id}-${index}`}>
                      {text && (
                        <p className="text-[rgb(var(--lb-blue-250))] text-[14px] mt-2">
                          {text}
                        </p>
                      )}
                      {list.length > 0 && (
                        <div>
                          {list?.map(({ id, point }) => (
                            <li
                              className="list-decimal text-[rgb(var(--lb-blue-250))] text-[14px] mt-2"
                              key={id}
                            >
                              {point}
                            </li>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-white font-bold text-sm mt-2">
                    Mission rewards:
                  </div>
                  <div className="flex gap-3 mt-2">
                    {gcValue && (
                      <div className="bg-black p-2 w-[40px] h-[40px] relative">
                        <Image
                          src={coins}
                          alt="gc-coin"
                          width={20}
                          height={20}
                          className="m-auto"
                        />
                        <div className="w-full text-white text-[11px] font-bold bg-black/30 text-center absolute bottom-0 left-0">
                          {gcValue}
                        </div>
                      </div>
                    )}
                    {scValue && (
                      <div className="bg-black p-2 w-[40px] h-[40px] relative">
                        <Image
                          src={usd}
                          alt="sc-coin"
                          width={20}
                          height={20}
                          className="m-auto"
                        />
                        <div className="w-full text-white text-[11px] font-bold bg-black/30 text-center absolute bottom-0 left-0">
                          {scValue}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  disabled
                  className="bg-[#102f5c] hover:bg-green-300 w-full h-[40px] leading-[42px] cursor-pointer text-center text-white font-bold rounded-[4px] mt-2"
                >
                  CLAIMED
                </Button>
              </AccordionContent> */}
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default Claimed;
