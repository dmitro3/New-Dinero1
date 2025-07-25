'use client';
import { cross, search } from '@/assets/svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import React from 'react';
import useLiveSupport from '../hook/useLiveSupport';
import { options } from '../constant';
import Message from './message';
import Help from './help';
import Home from './home';
const COMPONENT_MAPPING = {
  home: Home,
  help: Help,
  message: Message,
};
const LiveSupport = ({ isOpen, handleClick }) => {
  const { currentTab, handleOtionClick } = useLiveSupport();
  const Components = COMPONENT_MAPPING?.[currentTab];
  return (
    <Dialog open={isOpen} onOpenChange={handleClick} className="border-none ">
      <DialogContent className="max-w-[400px] -right-[46%] bottom-0 max-h-[458px] md:max-h-[458px] lg:max-h-[540px] h-full mx-auto mb-6 rounded-lg rounded-t-lg shadow-lg border-none  p-0 bg-white flex flex-col">
        <DialogHeader className="p-5  text-white bg-[rgb(var(--lb-blue-800))]">
          <div className="flex flex-row justify-between items-center">
            <div className="flex justify-center items-center space-x-2">
              <DialogTitle className="">{currentTab}</DialogTitle>
            </div>
            <div className="flex">
              <Image
                src={cross}
                alt="close icon"
                onClick={handleClick}
                className="invert hover:bg-gray-500 rounded-xl"
              />
            </div>
          </div>

          {currentTab === 'help' && (
            <div className="relative">
              <input
                type="text"
                placeholder="serch for help"
                className="w-full rounded-md p-2 text-black border-none "
              />
              <Image
                src={search}
                alt="search"
                className="right-3 absolute top-1/2 -translate-y-1/2"
              />
            </div>
          )}
        </DialogHeader>

        <div
          style={{
            overflowY: 'auto',
            // scrollbarWidth: 'none',
            // msOverflowStyle: 'none',
          }}
          className="flex-grow bg-slate-100 rounded-lg"
        >
          <Components />
        </div>

        <div className="px-5">
          <div className="flex justify-between items-center mt-auto">
            {options?.map((option, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleOtionClick(option.value)}
              >
                <div
                  className={`flex flex-col items-center cursor-pointer ${
                    currentTab === option.value
                      ? 'bg-slate rounded-2xl h-20 font-bold '
                      : ''
                  }`}
                >
                  <Image src={option.logo} alt="logo" width={25} height={25} />
                  <span className="text-sm">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveSupport;
