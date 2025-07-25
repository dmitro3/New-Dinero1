'use client';
import { bronzeKey, vipBronze } from '@/assets/png';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import useVip from '../hooks/useVip';
import VipBanner from './vip-banner';
import VipLevelsCards from './vip-levels-cards';
import styles from './style.module.scss';

const VipPage = () => {
  const { data, loading, user, overallProgress, rightPanel, fieldProgress } =
    useVip();

  const renderLoading = () => (
    <>
      <Skeleton className="w-full h-[200px] bg-[rgb(var(--lb-blue-300))] mb-5" />
      <Skeleton className="w-[350px] h-[300px] bg-[rgb(var(--lb-blue-300))] mb-5" />
      <div className="flex flex-wrap gap-2 justify-start">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <Skeleton
              key={idx}
              className={`flex items-center bg-[rgb(var(--lb-blue-300))] ${
                rightPanel
                  ? 'sm:w-[calc(50%-6px)] md:w-[calc(33.33%-6px)] lg:w-[calc(25%-6px)]'
                  : 'sm:w-[calc(50%-6px)] md:w-[calc(50%-6px)] lg:w-[calc(33.33%-6px)]'
              } p-4 rounded-lg h-[300px]`}
            />
          ))}
      </div>
    </>
  );

  return (
    <div className="p-6 bg-[hsl(var(--main-background))] relative">
      <h1 className="text-white text-2xl font-bold mb-6">VIP Rules</h1>
      {loading ? (
        renderLoading()
      ) : (
        <>
          <VipBanner />
          <div
            // className={`mb-8 flex flex-col md:flex-row items-center ${
            //   rightPanel ? 'w-[86vw] lg:w-[90vw]' : 'w-[47vw] lg:w-[62vw]'
            // }`}

            className={`${!rightPanel && 'flex-col lg:flex-row'} flex gap-4 overflow-hidden mt-[10px]`}
          >
            {/* <div className="flex flex-col md:flex-row w-full items-center"> */}
            <div className="mb-5 mb-3 w-full max-w-[350px] lg:mb-0 ">
              <h1 className="text-white text-xl font-bold mb-4">
                Your Current Rank
              </h1>
              <Card className="h-auto bg-[rgb(var(--lb-blue-500))] border-2 border-[var(--lb-blue-1400)] p-2 rounded-lg shadow-lg w-full min-w-[250px] max-w-[350px]">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center bg-gray-600 p-1 rounded-full shadow-md">
                    <Image
                      src={vipBronze}
                      alt="VIP Badge"
                      height={100}
                      width={100}
                      className="rounded-full"
                    />
                  </div>
                  <h2 className="text-gray-400 text-2xl font-bold">
                    Level: {user?.currentVipTier?.level ?? 'N/A'}
                  </h2>
                  <p className="text-white font-bold text-lg">
                    {user?.currentVipTier?.name ??
                      'Progress towards the next VIP level.'}
                  </p>
                  <div className="w-full">
                    <div className="flex justify-center items-center text-sm gap-2 font-bold text-gray-200">
                      {user?.currentVipTier?.name}
                      <Progress
                        value={overallProgress}
                        className="w-full h-3 bg-[var(--progress-bar)] rounded-full"
                      />
                      {user?.nextVipTier?.name}
                    </div>

                    <p className="text-white text-xs mt-2">
                      Progress: {overallProgress}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            <div
              className={`${!rightPanel && 'hidden lg:block'} md:h-56 md:w-[2px] mx-2 bg-black my-auto`}
            ></div>
            <div className="h-full w-full lg:w-auto my-auto">
              <h1 className="text-white text-xl font-bold mb-4">
                Your Progress
              </h1>

              <div
                className={`flex overflow  gap-4 ${styles.scrollbarcontainer}  ${rightPanel ? '  lg:w-[50vw]' : 'lg:w-[41vw]'}`}
              >
                {fieldProgress?.map((fields, index) => (
                  <Card
                    key={index}
                    className="h-auto w-[700px] bg-[rgb(var(--lb-blue-800))] border-2 border-[var(--lb-purple-1400)] rounded-lg shadow-lg pt-0"
                  >
                    <Progress
                      value={fields?.progress}
                      className="w- h-3 bg-[var(--progress-bar)] rounded-b-[0px]"
                    />
                    <div className="flex flex-col items-center text-center space-y-2 px-10 py-2">
                      <div className="flex items-center justify-center w-full">
                        <Image
                          src={bronzeKey}
                          alt="VIP Badge"
                          height={100}
                          width={100}
                          className="bg-transparent"
                        />
                      </div>
                      <p className="text-white font-bold text-lg p-1 text-wrap">
                        {fields?.name}
                      </p>
                      <div className=" items-center justify-between w-full space-y-2">
                        <p className="text-white text-xs">
                          Current Status: {parseInt(fields?.currentValue)}
                        </p>
                        <p className="text-white text-xs">
                          Target Value: {parseInt(fields?.nextValue)}
                        </p>
                      </div>
                      <div className="w-full px-5 py-[1px]">
                        <p className="text-white text-xs mt-2">
                          Progress: {parseInt(fields?.progress)}%
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            {/* </div> */}
          </div>
          <div>
            <h1 className="text-white text-xl font-bold mb-4 mt-4">Levels</h1>
            <div className="flex flex-wrap gap-2 justify-start">
              {data.map((vipData) => (
                <VipLevelsCards key={vipData?.vipTierId} vipData={vipData} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VipPage;
