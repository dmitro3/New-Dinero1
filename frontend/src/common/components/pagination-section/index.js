'use client';
import { Button } from '@/components/ui/button';
const PaginationSection = ({
  limit,
  totalCount,
  onShowMore,
  loading,
  renderLoading,
}) => {

  const progressPercentage = Math.min((limit / totalCount) * 100, 100);

  return (
    <div>
      {loading ? (
        renderLoading()
      ) : (
        <div className="flex flex-col items-center my-5">
          <div className="max-w-[300px] w-[300px] mx-auto bg-gray-300 rounded-full h-1 mb-1">
            <div
              className="bg-blue-900 h-1 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center text-white text-sm font-semibold space-x-2 mt-1">
            <span className="font-bold">{limit}</span>
            <span>Out of</span>
            <span className="font-bold">{totalCount}</span>
            <span>games displayed</span>
          </div>
          {limit >= totalCount || (
            <Button
              onClick={onShowMore}
              className="flex items-center justify-center text-white px-6 py-2 rounded-md mt-5 bg-background shiny-hover hover:bg-blue-900 hover:border hover:border-white transition focus:outline-none"
            >
              Show More
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaginationSection;
