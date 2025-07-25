import React, { useState } from 'react';
import CustomTableCard from '@/common/components/custom-table';
import {
  TABLE_CONFIG,
  tableContestOptions,
  tableGCSCOptions,
  tableRankOptions,
} from '../../constant';
import Tabs from '@/common/components/custom-tab';
import Image from 'next/image';
import { usd } from '@/assets/svg';
const tableData = [
  {
    rank: '1st',
    user: ' user name',
    score: 223333,
    prize: 9.34,
  },
  {
    rank: '2nd',
    user: ' user name',
    score: 223333,
    prize: 9.34,
  },
  {
    rank: '3srd',
    user: ' user name',
    score: 223333,
    prize: 9.34,
  },
  {
    rank: '4th',
    user: ' user name',
    score: 223333,
    prize: 9.34,
  },
];
const ProviderTable = () => {
  const [active, setActive] = useState('hourcontest');
  const [tableTabActive, setTableTabActive] = useState('rank');
  const [gcScActive, setGcScActive] = useState('gccontest');

  return (
    <>
      <Tabs
        options={tableContestOptions}
        active={active}
        setActive={setActive}
      />
      <div className="bg-[rgb(var(--lb-blue-900))] mt-3">
        <div className="h-16 flex items-center mx-5 justify-between">
          <div className="flex  gap-2">
            <div className="text-white font-bold flex items-center">
              {active === 'hourcontest' ? (
                'Hour Contest'
              ) : (
                <>
                  <Tabs
                    options={tableGCSCOptions}
                    active={gcScActive}
                    setActive={setGcScActive}
                  />
                  <span className="text-[rgb(var(--lb-blue-200))] text-sm underline cursor-pointer">
                    Rules
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4 ">
            <div className="text-[rgb(var(--lb-blue-100))] font-bold flex flex-wrap items-center gap-2 px-5 ">
              Prize Pool
              <div className="bg-[rgb(var(--lb-blue-400))] flex py-1 px-2 gap-2 rounded-2xl">
                <Image src={usd} alt="usd" />
                9866
              </div>
            </div>
            <div className="text-[rgb(var(--lb-blue-100))] font-bold flex flex-wrap items-center gap-x-2 px-5 ">
              Time Left
              <div className="flex items-center gap-2">
                <div className="bg-[rgb(var(--lb-blue-400))] rounded-lg">
                  <div className="text-white text-center  font-bold  p-2  w-full ">
                    30
                  </div>
                </div>
                <div className="text-white">:</div>
                <div className="bg-[rgb(var(--lb-blue-400))] rounded-lg">
                  <div className="text-white text-center  font-bold  p-2  w-full ">
                    00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-[rgb(var(--lb-blue-300))] mb-3"></div>
        <Tabs
          options={tableRankOptions}
          active={tableTabActive}
          setActive={setTableTabActive}
        />
        <CustomTableCard data={tableData} controls={TABLE_CONFIG} />
      </div>
    </>
  );
};

export default ProviderTable;
