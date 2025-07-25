'use client';
import { cross } from '@/assets/svg';
import CustomToast from '@/common/components/custom-toaster';
// import DatePicker from '@/common/components/date-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import React from 'react';

const ConfirmationModal = (props) => {
  const {
    isOpen,
    handleClick,
    checkedValue,
    handleRadio,
    handleDate,
    selectedDate,
    handleRequestSubmit,
    loading,
    message,
    setShowToast,
    showToast,
    status,
  } = props;
  return (
    <Dialog open={isOpen} onOpenChange={handleClick} className="">
      <DialogContent className="max-w-lg  mx-auto mb-6 rounded-lg shadow-lg border-none">
        <DialogHeader className="flex flex-row justify-between h-[30px]">
          <div className="flex justify-center items-center space-x-2">
            <DialogTitle className="text-white text-[2rem]">
              Self Exclusion
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
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <p className="text-white ml-1">Choose a self-exclusion type</p>
          <form onSubmit={handleRequestSubmit}>
            <RadioGroup
              onValueChange={handleRadio}
              defaultValue={checkedValue}
              className="flex space-x-1 space-y-1 mt-7"
            >
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="permanent" id="permanent" />
                <label htmlFor="permanent" className="font-normal text-white">
                  Permanent
                </label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="date" id="date" />
                <label htmlFor="date" className="font-normal text-white">
                  Choose Date
                </label>
                </div>
               
            </RadioGroup>
            <div>
            {checkedValue === 'date' && (
                  <div className="space-x-3 mt-5">
                    {/* <DatePicker
                  //   className="text-white"
                  selected={selectedDate}
                  onSelect={(date) => {
                    handleDate(date);
                  }}
                /> */}
                   <input
  className="w-[50%] p-2 border border-[rgb(var(--lb-blue-200))] text-white bg-transparent rounded-md 
             [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100"
  type="date"
  value={selectedDate}
  min={new Date().toISOString().split('T')[0]}
  onChange={(e) => {
    handleDate(e.target.value);
  }}
/>

                  </div>
                )}
            </div>
            <div className="mt-[50px] flex justify-end">
              <Button
                loading={loading}
                disabled={loading}
                className="bg-green-500 text-blue-950 font-semibold hover:bg-green-400"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
        <CustomToast
          message={message}
          setShowToast={setShowToast}
          showToast={showToast}
          status={status}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
