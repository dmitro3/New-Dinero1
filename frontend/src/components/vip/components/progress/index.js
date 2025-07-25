// import { vipChest, vipIcon } from '@/assets/png';
// import { coins, usd } from '@/assets/svg';
// import Image from 'next/image';
// import useProgress from '../../hook/useProgress';

// const Progress = ({ handleDialogClose }) => {
//   const { user, data, loading, handleClick } = useProgress({
//     handleDialogClose,
//   });
//   return (
//     <div className="text-white p-4 rounded-lg w-full">
//       <div className="bg-[rgb(var(--lb-purple-600))] px-3 rounded-lg mb-2">
//         <div className="flex justify-between items-center mb-2 ">
//           <span className="font-medium">
//             Level {user?.userDetails?.VipTier?.level}
//           </span>
//           <Image src={vipChest} alt="vipchest" width={23} height={25} />
//         </div>
//         <div className="w-full">
//           <div className="h-3  bg-[rgb(var(--lb-blue-200))] rounded-full">
//             <div
//               className="bg-blue-500 h-3 rounded-full transition-all"
//               style={{ width: `${50}%` }}
//             ></div>
//           </div>
//           <div className="text-sm text-right mb-4">50.00%</div>
//         </div>
//       </div>
//       <div
//         onClick={() => handleClick()}
//         className="w-full text-end text-slate-300 underline cursor-pointer"
//       >
//         Rules
//       </div>

//       <h6 className="font-semibold mb-2">VIP Rewards</h6>
//       {loading ? (
//         <div className="flex items-center justify-center h-[15rem]">
//           <div className="relative w-10 h-10">
//             <div className="absolute inset-0 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-2 w-[90%] mx-auto sm:w-full">
//           {data.map((reward) => (
//             <div
//               key={reward?.vipTierId}
//               className="p-3 rounded-lg gap-1 text-sm bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 shadow-lg font-semibold"
//             >
//               <div className="flex items-center gap-2">
//                 <Image
//                   src={reward?.icon || vipIcon}
//                   alt="vipicon"
//                   height={60}
//                   width={70}
//                 />
//                 <div>
//                   <p className="text-xl text-white font-bold">{reward?.name}</p>
//                   <div className="flex justify-between gap-3">
//                     <p className="flex gap-1">
//                       <Image src={coins} alt="gold" height={15} width={15} />
//                       {reward?.bonusSc}
//                     </p>
//                     <p className="flex gap-1">
//                       <Image src={usd} alt="usd" height={15} width={15} />
//                       {reward?.bonusGc}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white text-black text-sm rounded-lg w-[90%] mx-auto">
//                 <p>{reward?.boost}% Weekly Boost</p>
//                 <p>{reward?.rakeback}% Rakeback</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Progress;
import { vipChest } from '@/assets/png';
import { calendar, circlePercent, coin, gift, handsCoins } from '@/assets/svg';
import Image from 'next/image';
import React from 'react';
import useProgress from '../../hook/useProgress';
import useVip from '@/components/vip-page/hooks/useVip';
import CustomCircularloading from '@/common/components/custom-circular-loading';
import { Progress } from '@/components/ui/progress';

const ProgressSection = ({ handleDialogClose }) => {
  const { handleClick } = useProgress({
    handleDialogClose,
  });
  const { overallProgress, loading, user } = useVip();
  if (loading) return <CustomCircularloading />;
  return (
    <div className="text-white p-4 rounded-lg w-full">
      <div className="bg-[rgb(var(--lb-blue-600))] px-3 rounded-lg mb-2">
        <div className="flex justify-between items-center mb-2 ">
          <span className="font-medium">
            Level {user?.currentVipTier?.level ?? 'N/A'}
          </span>
          <Image src={vipChest} alt="vipchest" width={23} height={25} />
        </div>
        <div className="w-full">
          <div className="flex justify-center items-center text-sm gap-2 font-bold text-gray-200">
            {user?.currentVipTier?.name}
            <Progress
              value={overallProgress}
              className="w-full h-3 bg-[var(--progress-bar)] rounded-full"
            />
            {user?.nextVipTier?.name}
          </div>
          <div className="text-sm text-right mb-4">{overallProgress}%</div>
        </div>
      </div>
      <div
        onClick={() => handleClick()}
        className="w-full text-end text-slate-300 underline cursor-pointer"
      >
        Rules
      </div>

      <h6 className="font-semibold mb-2">
        VIP Club - Exclusive Player Benefits
      </h6>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-lg  flex items-center gap-1 text-sm bg-[rgb(var(--lb-blue-300))]">
          <Image src={gift} alt="gift icon" />
          <p>VIP Login bonus</p>
        </div>
        <div className="p-3 rounded-lg flex items-center gap-1 text-sm bg-[rgb(var(--lb-blue-300))]">
          <Image src={coin} alt="coin icon" />
          <p>Daily Bonus for VIP5+</p>
        </div>
        <div className="p-3 rounded-lg flex items-center gap-1 text-sm bg-[rgb(var(--lb-blue-300))]">
          <Image src={calendar} alt="calander" />
          <p>Weekly Bonus</p>
        </div>
        <div className="p-3 rounded-lg flex items-center gap-1 text-sm bg-[rgb(var(--lb-blue-300))]">
          <Image src={calendar} alt="calendar" />
          <p>Monthly bonus for VIP7+</p>
        </div>
        <div className="p-3 rounded-lg flex items-center gap-1 text-sm bg-[rgb(var(--lb-blue-300))]">
          <Image src={handsCoins} alt="hands coins" />
          <p>CASHBACK</p>
        </div>
        <div className="p-3 rounded-lg flex items-center gap-1 text-sm bg-[rgb(var(--lb-blue-300))]">
          <Image src={circlePercent} alt="circle percent" />
          <p>Rakeback Up to 25%</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
