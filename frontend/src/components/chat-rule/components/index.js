'use client';
import { cross } from '@/assets/svg';
import CustomCircularloading from '@/common/components/custom-circular-loading';
import CustomNoDataFound from '@/common/components/custom-noData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import useChatRule from '../hook/useChatRule';
import { isEmpty } from '@/lib/utils';

const ChatRule = ({ isOpen, handleClick }) => {
  const { getLoading, chatRuleData } = useChatRule();

  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent className="max-w-lg  mx-auto mb-6 rounded-lg shadow-lg border-none flex flex-col">
        <DialogHeader className="flex flex-row justify-between">
          <div className="flex justify-center items-center space-x-2">
            <DialogTitle className="text-white text-[18px] mt-[6px]">
              Chat Rule
            </DialogTitle>
          </div>

          <Image
            src={cross}
            alt="close icon"
            onClick={handleClick}
            className="invert hover:bg-gray-500 rounded-xl "
          />
        </DialogHeader>
        <div
          style={{
            maxHeight: '24rem',
            overflowY: 'auto',
          }}
          className="scrollable-Content"
        >
          {getLoading ? (
            <CustomCircularloading />
          ) : !isEmpty(chatRuleData) ? (
            <div
              className="text-[rgb(var(--lb-blue-200))] space-y-5 mt-3"
              dangerouslySetInnerHTML={{
                __html: chatRuleData?.rules || 'No content available',
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

export default ChatRule;
