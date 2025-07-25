import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import React from 'react';

const LiveStatusModal = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-sm mx-auto mb-6 rounded-lg shadow-lg border-none">
        <DialogTitle className="flex justify-between items-center border-b pb-2 mb-4 text-white">
          <span className="text-lg font-medium ">Live Status</span>
          <DialogClose asChild>
            <button className=" hover:text-gray-600">
            </button>
          </DialogClose>
        </DialogTitle>
        <DialogDescription className= "space-y-2">
          <div className="flex justify-between">
            <span>Wagered (SC):</span>
            <span>0.0000</span>
          </div>
          <div className="flex justify-between">
            <span>Profit (SC):</span>
            <span>0.0000</span>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default LiveStatusModal;
