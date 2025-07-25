import { cross, task } from '@/assets/svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import React from 'react';
import Tab from './tab';

const TaskList = ({ isOpen, handleClick }) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClick} className="">
      <DialogContent className="max-w-lg  mx-auto mb-6 rounded-lg shadow-lg border-none">
        <DialogHeader className="flex flex-row justify-between  max-h-10">
          <div className="flex justify-center items-center space-x-2">
            <Image src={task} alt="taskList-image" width={18} height={18} />
            <DialogTitle className="text-white text-[18px]">
              Task List
            </DialogTitle>
          </div>

          <Image
            src={cross}
            alt="close icon"
            onClick={handleClick}
            className="invert hover:bg-gray-500 rounded-xl"
          />
        </DialogHeader>
        <div
          style={{
            maxHeight: '24rem',
            overflowY: 'auto',
          }}
          className="scrollable-Content"
        >
          <Tab />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskList;
