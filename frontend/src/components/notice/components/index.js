'use client';
import { cross } from '@/assets/svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import React from 'react';
import useNotice from '../hook/useNotice';
import CustomNoDataFound from '@/common/components/custom-noData';
import { Skeleton } from '@/components/ui/skeleton';

const NoticeSkeleton = () => {
  return (
    <Skeleton>
      <div className="h-6 w-1/3 bg-[rgb(var(--lb-blue-300))] rounded-md mb-8"></div>
      <div className="space-y-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-4 w-full bg-[rgb(var(--lb-blue-300))] rounded-md"></div>
        ))}
      </div>
    </Skeleton>
  );
};

const Notice = ({ isOpen, handleClick }) => {
  const { getLoading, noticeData } = useNotice();

  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent className="max-w-lg mx-auto mb-6 rounded-lg shadow-lg border-none flex flex-col">
        {/* Updated DialogHeader with a thin, sleek scrollbar */}
        <DialogHeader 
          className="flex flex-row justify-between max-h-20 overflow-y-auto p-2"
          style={{
            maxHeight: '5rem',
            scrollbarWidth: 'thin', // Firefox
            scrollbarColor: 'rgba(255, 255, 255, 0.4) transparent',
          }}
        >
          <div className="flex justify-center items-center space-x-2">
            <DialogTitle className="text-white text-[18px] mt-[6px]">
              {noticeData?.title?.EN || 'Notice'}
            </DialogTitle>
          </div>

          <Image
            src={cross}
            alt="close icon"
            onClick={handleClick}
            className="invert hover:bg-gray-500 rounded-xl cursor-pointer"
          />
        </DialogHeader>

        <div
          className="scrollable-Content overflow-y-auto"
          style={{
            maxHeight: '24rem',
            scrollbarWidth: 'thin', // Firefox
            scrollbarColor: 'rgba(255, 255, 255, 0.4) transparent',
          }}
        >
          {getLoading ? (
            <NoticeSkeleton />
          ) : noticeData?.content?.EN ? (
            <div
              className="text-[rgb(var(--lb-blue-200))] space-y-5 mt-3"
              style={{
                overflowY: 'auto',
                scrollbarWidth: 'thin', // Firefox
                scrollbarColor: 'rgba(255, 255, 255, 0.4) transparent',
              }}
              dangerouslySetInnerHTML={{
                __html: noticeData?.content?.EN || 'No content available',
              }}
            ></div>
          ) : (
            <CustomNoDataFound />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Notice;
