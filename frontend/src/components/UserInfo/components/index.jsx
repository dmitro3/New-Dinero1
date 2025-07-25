'use client';

import { headPortrait } from '@/assets/png';
import { cross, penLine, profile } from '@/assets/svg';
import CoinToggler from '@/components/Header/components/CoinToggler';
import {
  AvatarFallback,
  Avatar as AvatarIcon,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import useUserInfo from '../hooks/useUserInfo';
import { isEmpty, truncateDecimals } from '@/lib/utils';
import CustomCircularloading from '@/common/components/custom-circular-loading';

const UserInfo = ({
  isOpen,
  handleClick,
  chatUserData = {},
  chatUserLoading = false,
}) => {
  const { userData = {}, handleClickEdit, userLoading } = useUserInfo();
  const isChatData = !isEmpty(chatUserData);

  // Ensure displayData is always an object to prevent destructuring errors
  const displayData = isChatData ? chatUserData : (userData || {});

  const {
    username = '',
    profileImage = '',
    level = 0,
    losses = 0,
    win = 0,
    betCount = 0,
    wagered = 0,
    currentVipTier = {},
  } = displayData;

  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent className="w-full max-w-lg p-6 rounded-md border-none">
        <DialogHeader className="flex flex-row justify-between">
          <div className="flex items-center space-x-2">
            <Image src={profile} alt="store image" />
            <DialogTitle className="text-white">User Info</DialogTitle>
          </div>
          <Image
            src={cross}
            alt="close icon"
            onClick={handleClick}
            className="invert hover:bg-gray-500 rounded-xl cursor-pointer"
          />
        </DialogHeader>

        {userLoading || chatUserLoading ? (
          <CustomCircularloading />
        ) : (
          <>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-20 h-20 rounded-full">
                <AvatarIcon className="h-20 w-20">
                  <AvatarImage src={profileImage} alt="avatar" />
                  <AvatarFallback>
                    <Image
                      src={headPortrait}
                      alt="profile fallback"
                      width={80}
                      height={80}
                    />
                  </AvatarFallback>
                </AvatarIcon>
              </div>

              <div className="flex justify-between items-center w-full">
                <div className="space-x-4 flex items-center">
                  <h2 className="text-white text-lg font-bold">
                    {username || 'User Name'}
                  </h2>
                  <p className="text-sm text-white bg-[rgb(var(--lb-blue-900))] py-1 px-2 rounded-2xl font-bold">
                    Level: <span>{currentVipTier?.level ?? level}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    disabled={isChatData}
                    className="p-2 bg-background"
                    onClick={() => {
                      handleClickEdit();
                      handleClick();
                    }}
                  >
                    <Image src={penLine} alt="edit icon" />
                  </Button>
                </div>
              </div>
            </div>

            {!isChatData && (
              <div className="mr-auto max-w-fit">
                <CoinToggler isPopupRequired={false} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-3 p-1">
              <div className="text-center bg-[rgb(var(--lb-blue-500))] rounded-md">
                <p className="text-white text-md font-bold">
                  {truncateDecimals(win, 2) || 0}
                </p>
                <p className="text-gray-400 text-sm">WINS</p>
              </div>
              <div className="text-center bg-[rgb(var(--lb-blue-500))] rounded-md">
                <p className="text-white text-md font-bold">
                  {truncateDecimals(losses, 2) || 0}
                </p>
                <p className="text-gray-400 text-sm">LOSSES</p>
              </div>
              <div className="text-center bg-[rgb(var(--lb-blue-500))] rounded-md">
                <p className="text-white text-md font-bold">
                  {truncateDecimals(betCount, 2) || 0}
                </p>
                <p className="text-gray-400 text-sm">BETS</p>
              </div>
              <div className="text-center bg-[rgb(var(--lb-blue-500))] rounded-md">
                <p className="text-white text-md font-bold">
                  {truncateDecimals(wagered, 2) || 0}
                </p>
                <p className="text-gray-400 text-sm">WAGERED</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserInfo;
