import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useSeed from '../hooks/useSeed';
import Image from 'next/image';
import { cross } from '@/assets/svg';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Seed = () => {
  const { isOpen, handleClose = () => {}, t } = useSeed();
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg p-6 rounded-md border-none">
        <DialogHeader className="flex flex-row justify-between">
          <div className="flex justify-center items-center space-x-2">
            <DialogTitle className="text-white">{t('Seed')}</DialogTitle>
          </div>
          <Image
            src={cross}
            alt="close icon"
            onClick={handleClose}
            className="invert hover:bg-gray-500 rounded-xl mt-0"
          />
        </DialogHeader>
        <div className="py-[2rem]">
          <div>
            <div className="text-[rgb(var(--lb-blue-250))] text-[13px] font-semibold">
              {t('New Client Seed')}
            </div>
            <div className="mt-2 flex items-center">
              <Input
                className="rounded-sm border-[rgb(var(--lb-blue-200))] w-[80%] bg-[rgb(var(--lb-blue-900))]"
                name="new-client-seed"
              />
              <Button className="bg-green-400 w-[20%] hover:bg-green-300 py-[1.25rem] rounded-r-md rounded-l-none text-blue-950 font-semibold">
                {t('Change')}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-[rgb(var(--lb-blue-250))] text-[13px] font-semibold">
              {t('New Server Seed (Hashed)')}
            </div>
            <div className="mt-2 flex items-center">
              <Input
                className="rounded-sm border-[rgb(var(--lb-blue-200))] w-[80%] bg-[rgb(var(--lb-blue-900))]"
                name="new-server-seed"
                readOnly
              />
              <Button className="bg-green-400 w-[20%] hover:bg-green-300 py-[1.25rem] rounded-r-md rounded-l-none text-blue-950 font-semibold">
                {t('Change')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Seed;
