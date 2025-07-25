import { noDataImage } from '@/assets/webp';
import Image from 'next/image';

const IgnoredUsers = () => {
  return (
    <section className="border border-[rgb(var(--lb-blue-300))] rounded p-2 text-center">
      <div className="flex justify-center">
        <Image
          src={noDataImage}
          className="h-[116px] w-[130px] mb-1"
          alt="empty"
          fill
        />
      </div>
      <div className="text-white text-[13px] mb-2">
        No ignored users to show
      </div>
    </section>
  );
};
export default IgnoredUsers;
