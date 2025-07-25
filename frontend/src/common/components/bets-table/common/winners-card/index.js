import { headPortrait, rank1, rank2, rank3 } from '@/assets/png';
import { facebook, twitter, usd } from '@/assets/svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserInfo from '@/components/UserInfo/components';
import Image from 'next/image';
import useWinnerCard from '../../hooks/useWinnerCard';
import styles from './style.module.scss';
import { truncateDecimals } from '@/lib/utils';

const WinnersCard = ({ data = {}, rank }) => {
  const { chatUserLoading, handleOpenUserInfo, isOpen, setIsOpen, userData } =
    useWinnerCard();
  const {
    profileimage,
    total_bet_amount,
    total_win_amount,
    user_id,
    username,
    // win_difference,
  } = data;
  const profileImage = profileimage || '';
  const rankImages = {
    1: rank1,
    2: rank2,
    3: rank3,
  };
  const profileBorderStyle = {
    1: 'border-yellow-400',
    2: 'border-sky-400',
    3: 'border-amber-400',
  };
  const renderRankTag = () => rankImages[rank] || rank3;
  const multiplier = total_win_amount / total_bet_amount;
  return (
    <div className="bg-[#102f5c60] max-w-[32%]  w-auto min-w-[32%] flex-1 rounded flex flex-col items-center">
      <div className={`px-4 py-2 md:flex gap-2 w-full ${styles.bgWinnerCard}`}>
        <div
          className="flex flex-col m-auto items-start w-[29%] p-1 cursor-pointer"
          onClick={() => handleOpenUserInfo(user_id)}
        >
          <div
            className={`rounded-full border-[3px] ${profileBorderStyle[rank] || 'border-amber-400'} relative m-auto`}
          >
            <Avatar>
              <AvatarImage
                src={profileImage}
                width={12}
                height={12}
                alt={username}
              />
              <AvatarFallback>
                <Image
                  src={headPortrait}
                  alt="profileImage"
                  width={50}
                  height={50}
                />
              </AvatarFallback>
            </Avatar>
            <Image
              className="absolute bottom-[-11px] left-[-12px] max-w-[64px]"
              src={renderRankTag(rank)}
              alt={`rank-${rank}`}
            />
          </div>
          <div className="w-full mt-3 ">
            <div className="text-white text-xs text-center md:truncate">
              {username}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-xs text-[rgb(var(--lb-blue-250))] font-medium">
                User ID:
              </p>
              <p className="text-[13px] underline text-white ">{user_id}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-[rgb(var(--lb-blue-900))] hover:bg-[rgb(var(--lb-blue-900))] p-[1px]">
                <Image
                  src={facebook}
                  alt="fb-icon"
                  width={18}
                  height={18}
                  className="opacity-70"
                />
              </button>
              <button className="bg-[rgb(var(--lb-blue-900))] hover:bg-[rgb(var(--lb-blue-900))] p-[1px]">
                <Image
                  src={twitter}
                  alt="twitter-icon"
                  width={18}
                  height={18}
                  className="opacity-70"
                />
              </button>
            </div>
          </div>
          <div className="flex justify-evenly gap-1 mt-2 bg-[rgb(var(--lb-blue-900))] p-1 rounded">
            <div className="flex flex-col items-center">
              <p className="text-[14px] text-[rgb(var(--lb-blue-250))] font-medium">
                Multiplier
              </p>
              <p className="text-[12px] text-center text-white ">
                {truncateDecimals(multiplier, 2)}X
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[14px] text-[rgb(var(--lb-blue-250))] font-medium">
                Result
              </p>
              <div className="text-[12px] text-center text-white flex ">
                <Image src={usd} width={13} height={13} alt="gc-icon" />
                {total_win_amount}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <UserInfo
          isOpen={isOpen}
          handleClick={() => setIsOpen(!isOpen)}
          chatUserData={userData}
          chatUserLoading={chatUserLoading}
        />
      )}
    </div>
  );
};

export default WinnersCard;
