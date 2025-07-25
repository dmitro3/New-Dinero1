import { Skeleton } from '@/components/ui/skeleton';

export default function HomeCustomCardSkeleton({ rows = 10, className = '' }) {
  return (
    <div className="flex gap-3 mt-4 w-full mx-auto w-[93%] sm:w-[98%] overflow-x-hidden-scroll justify-center">
      {Array.from(new Array(rows)).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex-none relative overflow-hidden rounded-lg transition-all duration-200 ease-in-out 
             w-[110px] h-[110px] md:w-[160px] md:h-[160px] lg:w-[125px] lg:h-[125px] xl:w-[144px] xl:h-[144px] ${className}`}
        >
          <Skeleton className="w-full h-full bg-[rgb(var(--lb-blue-300))]" />
        </div>
      ))}
    </div>
  );
}
