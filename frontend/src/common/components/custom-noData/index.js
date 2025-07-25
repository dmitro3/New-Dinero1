import { noDataFound } from '@/assets/png';
import Image from 'next/image';

const CustomNoDataFound = ({
  className = '',
  message = 'No data available',
}) => {
  return (
    <div
      className={`flex flex-col items-center mt-4 justify-center h-[300px] ${className}`}
    >
      <Image
        src={noDataFound}
        alt="No data available"
        width={180}
        height={180}
      />
      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  );
};

export default CustomNoDataFound;
