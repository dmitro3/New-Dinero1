'use client';

import { winner } from '@/assets/png';
import { CASINO_TABLE_CONFIG } from '@/components/transaction/constants';
import Image from 'next/image';
import CustomNoDataFound from '../../custom-noData';
import Tabs from '../../custom-tab';
import CustomTableCard from '../../custom-table';
import WinnersCard from '../common/winners-card';
import {
  // COMMON_TABLE_CONFIG,
  HIGH_ROLLERS_TABLE_CONFIG,
  // rowLimitOptions,
  tablePlayOptions,
} from '../constant';
import useBetsTable from '../hooks/useBetsTable';
import useMyPlay from '../hooks/useMyPlay';
import useTopThreePlayers from '../hooks/useTopThreePlayers';
//import CustomSelect from '../../custom-select';

const BetsTable = () => {
  const { playData } = useMyPlay();
  const {
    active,
    setActive,
    //commonTableColumnList,
    //myPlaysTableColumnList,
    // selectedRowLimit,
    // handleRowLimitChange,
    t,
    betsData,
  } = useBetsTable();

  const { topPlayersData } = useTopThreePlayers();

  const tableData =
    active === 'highRollers' || active === 'rareWin' ? betsData : playData;

  const tableConfig =
    active === 'highRollers' || active === 'rareWin'
      ? HIGH_ROLLERS_TABLE_CONFIG
      : CASINO_TABLE_CONFIG;

  return (
    <>
      <div className="flex justify-between items-center p-2 mt-6 relative">
        <Tabs
          options={tablePlayOptions}
          active={active}
          setActive={setActive}
        />
        {/* <CustomSelect
          options={rowLimitOptions}
          selectedValue={selectedRowLimit}
          onValueChange={handleRowLimitChange}
          className="sm:w-[60px] w-[17%]"
        /> */}
      </div>
      <div className="mt-4 p-2 max-w-[100%]">
        {active === 'rareWin' && (
          <div className="bg-[rgb(var(--lb-blue-800))]">
            <div className="flex">
              <div className="relative mx-auto my-6">
                <Image src={winner} alt="winner-tag" />
                <span className="absolute top-0 translate-x-[65%] translate-y-[45%] font-bold text-sm">
                  {t('Biggest Win Weekly')}
                </span>
              </div>
            </div>
            <div className="flex gap-3 p-4">
              {topPlayersData?.map((data = {}, index) => (
                <WinnersCard key={data?.user_id} data={data} rank={index + 1} />
              ))}
            </div>
          </div>
        )}

        {tableData?.length > 0 ? (
          <CustomTableCard data={tableData || []} controls={tableConfig} />
        ) : (
          <CustomNoDataFound message="Data Not Found" />
        )}
      </div>
    </>
  );
};

export default BetsTable;
