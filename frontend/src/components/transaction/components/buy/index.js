'use client';
import CustomNoDataFound from '@/common/components/custom-noData';
import CustomTableSkeleton from '@/common/components/custom-table-skeleton';
import { isEmpty } from '@/lib/utils';
import { TRANSACTION_TABLE_CONFIG } from '../../constants';
import Table from '../table';
import CustomTablePagination from '@/common/components/custom-table-pagination';

const Buy = ({ data, limit, loading, pageNo, totalCount, setPageNo }) => {
  if (loading)
    return (
      <CustomTableSkeleton
        rows={limit}
        columns={TRANSACTION_TABLE_CONFIG.length}
      />
    );
  if (isEmpty(data)) {
    return <CustomNoDataFound className="!h-[260px]" />;
  }

  return (
    <div className="mt-2 w-full">
      <Table data={data} controls={TRANSACTION_TABLE_CONFIG} />
      {totalCount > limit && (
        <CustomTablePagination
          totalCount={totalCount}
          pageNo={pageNo}
          setPageNo={setPageNo}
          limit={limit}
        />
      )}
    </div>
  );
};

export default Buy;
