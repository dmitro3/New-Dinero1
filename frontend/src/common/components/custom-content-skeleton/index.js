import { Skeleton } from '@/components/ui/skeleton';

export default function CustomContentSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4">
      {Array(rows)
        .fill(0)
        ?.map((_, index) => (
          <div key={index} className="space-y-2 p-4 px-10">
            <Skeleton className="h-6 w-3/4 bg-[#102f5c]" />

            <Skeleton className="h-[200px] w-full bg-[#102f5c]" />
          </div>
        ))}
    </div>
  );
}
