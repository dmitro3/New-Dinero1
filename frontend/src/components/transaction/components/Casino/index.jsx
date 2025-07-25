'use client';
import CustomNoDataFound from '@/common/components/custom-noData';
import CustomTableSkeleton from '@/common/components/custom-table-skeleton';
import { isEmpty } from '@/lib/utils';
import { CASINO_TABLE_CONFIG } from '../../constants';
import Table from '../table';
import CustomTablePagination from '@/common/components/custom-table-pagination';
// import CustomTableCard from '@/common/components/custom-table';

const Casino = ({
  loading,
  casinoData,
  casinoPageNo,
  totalCount,
  setCasinoPageNo,
  limit,
}) => {
  // const { casinoData, limit,casinoLoading } = useCasinoTransaction();
  if (loading) return <CustomTableSkeleton rows={6} columns={10} />;
  if (isEmpty(casinoData)) {
    return <CustomNoDataFound className="!h-[260]" />;
  }
  return (
    <div className="mt-2 w-full">
      <Table data={casinoData} controls={CASINO_TABLE_CONFIG} />
      {totalCount > limit && (
        <CustomTablePagination
          totalCount={totalCount}
          pageNo={casinoPageNo}
          setPageNo={setCasinoPageNo}
          limit={limit}
        />
      )}
    </div>
  );
};

export default Casino;
