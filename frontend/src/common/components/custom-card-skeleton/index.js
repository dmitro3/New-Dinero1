import { Skeleton } from '@/components/ui/skeleton';

export default function CustomCardSkeleton({ rows = 10 }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 mx-auto w-[100%]">
      {Array.from(new Array(rows)).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex-none relative overflow-hidden rounded-lg transition-all duration-200 ease-in-out 
             w-[110px] h-[110px] md:w-[160px] md:h-[160px] lg:w-[125px] lg:h-[125px] xl:w-[155px] xl:h-[155px]"
        >
          <Skeleton className="w-full h-full bg-[rgb(var(--lb-blue-300))]" />
        </div>
      ))}
    </div>
  );
}
