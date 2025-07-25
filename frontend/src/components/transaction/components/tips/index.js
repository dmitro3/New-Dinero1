'use client';
import CustomNoDataFound from '@/common/components/custom-noData';
import CustomTablePagination from '@/common/components/custom-table-pagination';
import CustomTableSkeleton from '@/common/components/custom-table-skeleton';
import { isEmpty } from '@/lib/utils';
import { TRANSACTION_TABLE_CONFIG } from '../../constants';
import Table from '../table';

const Tips = ({ data, limit, loading, pageNo, totalCount, setPageNo }) => {
  // Exclude the 'status' field
  const filteredConfig = TRANSACTION_TABLE_CONFIG.filter(item => item.value !== 'status');

  if (loading)
    return (
      <CustomTableSkeleton
        rows={limit}
        columns={filteredConfig.length}
      />
    );

  if (isEmpty(data)) {
    return <CustomNoDataFound className="!h-[260px]" />;
  }

  return (
    <div className="mt-2 w-full">
      <Table data={data} controls={filteredConfig} />
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

export default Tips;
