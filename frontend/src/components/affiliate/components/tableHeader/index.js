'use strict';

import CustomSelect from '@/common/components/custom-select';
import { useStateContext } from '@/store';
import { SORT_OPTIONS } from '../../constant';

const RefTableHeader = ({ activeTab, setActiveTab }) => {
  const {
    state: { user },
  } = useStateContext();

  const onTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 border-b pb-4 border-[rgb(var(--lb-blue-300))] ">
        {/* Campaign Name Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Referral Code</label>
          <div className="px-2 py-1 rounded bg-transparent border border-[rgb(var(--lb-blue-300))]  text-gray-300">
            {user ? user.username : '...'}
          </div>
        </div>

        {/* Sorted By Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Sorted by</label>
          <CustomSelect
            options={SORT_OPTIONS}
            selectedValue={activeTab}
            onValueChange={onTabChange}
            className={'bg-transparent border-[rgb(var(--lb-blue-300))]'}
          />
        </div>
      </div>
    </>
  );
};
export default RefTableHeader;
