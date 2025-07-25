'use client';
import React, { useState } from 'react';
import style from './style.module.scss';
import CustomSelect from '@/common/components/custom-select';
import PanelTabs from '@/common/components/panel-table';
import { FAQ_MAPPING, TAB_CONTROLS } from '../constant';
import { useRouter } from 'next/navigation';
import FaqListing from './faq-listing';
import Image from 'next/image';
import { helpFill } from '@/assets/svg';

const Faq = () => {
  const [activeTab, setActiveTab] = useState(TAB_CONTROLS[0].value);

  const router = useRouter();

  const onClose = () => {
    router.push('/');
  };

  return (
    <div className={`${style.wrapContainer} bg-[hsl(var(--main-background))]`}>
      <section>
        <div className="flex justify-between mb-4">
          <div className="text-white box-border font-montserrat text-[20px] font-extrabold flex gap-2">
            <Image src={helpFill} alt="faq-icon" width={20} height={20} />{' '}
            <span>Frequently Asked Questions</span>
          </div>
          <div className="text-white cursor-pointer" onClick={onClose}>
            X
          </div>
        </div>
        <div className="block xl:hidden mb-2">
          <CustomSelect
            options={TAB_CONTROLS}
            selectedValue={activeTab}
            onValueChange={setActiveTab}
          />
        </div>
        <div className="flex gap-5 xl:grid-flow-col items-start ">
          <div className="hidden xl:block sticky top-[5rem]">
            <PanelTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabControls={TAB_CONTROLS}
            />
          </div>
          <div className="bg-[rgb(var(--lb-blue-900))] p-6 xl:tw-p-6  rounded overflow-hidden w-full">
            <FaqListing faqData={FAQ_MAPPING?.en?.[activeTab]} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
