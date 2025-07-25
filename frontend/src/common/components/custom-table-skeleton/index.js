import { Skeleton } from '@/components/ui/skeleton';

export default function CustomTableSkeleton({ rows = 10, columns = 3 }) {
  return (
    <div className="space-y-2 mt-4 w-full ">
      {Array.from(new Array(rows)).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-3">
          {Array.from(new Array(columns)).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-9 w-full bg-[rgb(var(--lb-blue-300))] rounded-md"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
