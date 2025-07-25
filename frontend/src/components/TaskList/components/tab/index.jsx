import Tabs from '@/common/components/custom-tab';
import React, { useState } from 'react';
import { options } from '../../constants';
import Active from '../active';
import Claimed from '../claimed';

const COMPONENT_MAPPING = {
  active: Active,
  claimed: Claimed,
};

const Tab = () => {
  const [active, setActive] = useState('active');
  const Components = COMPONENT_MAPPING?.[active];

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Tabs options={options} active={active} setActive={setActive} />
      {Components ?<div className="w-full min-h-[300px]"> <Components /></div> : null}
    </div>
  );
};

export default Tab;
