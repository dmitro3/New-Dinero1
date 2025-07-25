import { Image404 } from '@/assets/png';
import Image from 'next/image';

function Custom404Page({ msg }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-72 h-72">
        <Image
          src={Image404}
          alt="not-found"
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-lg text-[var(--progress-bar)]">{msg}</p>
    </div>
  );
}

export default Custom404Page;
