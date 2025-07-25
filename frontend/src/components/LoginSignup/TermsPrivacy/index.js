'use client';
import { cross } from '@/assets/svg';
import CustomContentSkeleton from '@/common/components/custom-content-skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

const CustomDialog = ({ isOpen, onClose, type, loading, data }) => {
  const dialogTitle = type === 'terms' ? 'Terms of Service' : 'Privacy Policy';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-white max-w-[800px] focus:outline-none rounded-3xl">
        <DialogHeader className="relative">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <button onClick={onClose} className="absolute right-0 top-0">
            <Image
              src={cross}
              alt="close icon"
            //   height={20}
            //   width={20}
              className="invert hover:bg-gray-500 rounded-3xl"
            />
          </button>
        </DialogHeader>
        {loading ? (
          <CustomContentSkeleton rows={1} />
        ) : (
          <div className="max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] text-white">
            <div className="!text-white" dangerouslySetInnerHTML={{ __html: data }} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
