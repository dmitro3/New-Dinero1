import React from 'react';
import { HELP_DATA } from '../../constant';

const Help = () => {
  return (
    <div className="h-full bg-slate-100 text-black p-4">
      <p className="font-semibold py-2">5 Collection</p>

      {HELP_DATA.map((data, index) => (
        <div key={index} className="border-y hover:bg-slate-200 p-2 hover:cursor-pointer">
          <p className="font-semibold">{data.heading}</p>
          <p>{data.text}</p>
          <p>{data.article}</p>
        </div>
      ))}
    </div>
  );
};

export default Help;
