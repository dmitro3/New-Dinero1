import { Skeleton } from '@/components/ui/skeleton';

export default function CustomListSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array(rows)
        .fill(0)
        ?.map((_, index) => (
          <Skeleton key={index} className="h-2 w-[130px] bg-[#102f5c] !mb-3" />
        ))}
    </div>
  );
}
