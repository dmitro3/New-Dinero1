import { search } from '@/assets/svg';
import Image from 'next/image';
import React from 'react';
import { HELP_DATA } from '../../constant';

const Home = () => {
  return (
    <div className="h-full bg-slate-100 text-black flex gap-5 flex-col items-center">
      {/* <Image src={logoImage} alt='logo' height={200} width={300} className=''/> */}

      <p className="text-2xl font-bold text-center">
        Hi User 👋 How can we help?
      </p>
      <div className="w-[85%]  border bg-white shadow-black shadow-sm rounded-lg">
        <p className="font-bold p-2">Ask a question</p>
        <p className="px-2 pb-2">We typically reply in a few hours</p>
      </div>
      <div className="w-[85%] border bg-white shadow-black shadow-sm rounded-lg">
        <div className="relative border p-2">
          <input
            type="text"
            placeholder="serch for help"
            className="w-full rounded-md p-2 border-none text-black bg-gray-200"
          />
          <Image
            src={search}
            alt="search"
            className="right-3 absolute top-1/2 -translate-y-1/2"
          />
        </div>
        {HELP_DATA.map((data, index) => (
          <div
            key={index}
            className="hover:bg-slate-200 p-1 hover:cursor-pointer"
          >
            <p className="text-sm">{data.heading}</p>
            {/* <p>{data.text}</p> */}
            {/* <p>{data.article}</p> */}
          </div>
        ))}
      </div>

      <div className="w-[85%]  border bg-white shadow-black shadow-sm rounded-lg">
        <p className="font-bold p-2">What&apos;s new on Luckybird</p>
        <div className="hover:bg-slate-200 p-1 hover:cursor-pointer border-y">
          Now Supports SQL currency for purchase and Readdemption!
        </div>
      </div>
    </div>
  );
};

export default Home;
