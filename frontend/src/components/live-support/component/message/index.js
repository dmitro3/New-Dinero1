import { message } from '@/assets/svg';
import Image from 'next/image';
import React from 'react';

const Message = () => {
  return (
    <div className="flex justify-center items-center flex-col my-auto h-full font-bold gap-3 bg-slate-100">
        <Image src={message} alt="message" width={50} height={50} className="mt-9"/>
        <h3>No Message</h3>
        <p className="font-semibold text-sm">Messages from the team will be shown here</p>
        <button className="mt-7  bg-[rgb(var(--lb-blue-800))] text-white px-3 py-1 rounded-md"> Ask a question</button>

    </div>
  );
};

export default Message;