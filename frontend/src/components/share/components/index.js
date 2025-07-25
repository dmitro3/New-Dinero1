'use client';
import { cross, share } from '@/assets/svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { PLATFORMS, REF_LINK, POP_UP_WINDOW } from '../constants';
import { useStateContext } from '@/store';
import InviteCard from './inviteCard';

const Share = ({ isOpen, handleClick }) => {
  const {
    state: { user },
  } = useStateContext();
  const username = user?.username;
  const refLink = REF_LINK + username;
  const encodedRefLink = encodeURIComponent(refLink);

  const handleInvite = (platform) => {
    const url = platform.url(encodedRefLink);

    /* eslint-disable */
    const { height, width } = POP_UP_WINDOW;

    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    if (url) {
      window.open(
        url,
        'Compose Post', // Name of the new window
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );
      /* eslint-enable */
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent className="w-full max-w-lg px-0 rounded-md border-none max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row justify-between max-h-10 mb-4 px-6">
          <div className="flex justify-center items-center space-x-2">
            <Image src={share} alt="sotre image" />
            <DialogTitle className="text-white">Share</DialogTitle>
          </div>

          <Image
            src={cross}
            alt="close icon"
            onClick={handleClick}
            className="invert hover:bg-gray-500 rounded-xl"
          />
        </DialogHeader>

        <div className="text-white text-sm overflow-y-auto flex-grow max-h-[70vh] scrollable-Content">
          <div className="flex flex-col gap-5 px-10 mb-4">
            {PLATFORMS.map((platform) => (
              <InviteCard
                platform={platform}
                handleInvite={handleInvite}
                key={platform.name}
              />
            ))}
          </div>
          <div className="px-4">
            <p className="font-bold text-center mb-2">
              More friends you invited,means earn more.
            </p>
            <p className="text-center text-[rgb(var(--lb-blue-250))] leading-4 tracking-wide">
              You will earn the commission from your friends’ each betting.You
              can view the commission that you have earn in AFFILIATE page.{' '}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Share;
