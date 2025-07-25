'use client';

import { useRouter } from 'next/navigation';

export default function Error({ error, reset }) {
  console.log('error, reset: ', error, reset);
  const router = useRouter();
  return (
    <div className="flex flex-col items-center  justify-center  h-screen bg-[hsl(var(--main-background))]">
      <div className="relative bg-white/10 backdrop-blur-lg shadow-lg rounded-xl  p-3 md:p-8 text-center max-w-[300px] sm:max-w-md border border-white/20 transition-all duration-500 ">
        <div className="w-9 h-9  sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="sm:text-4xl font-bold text-white">!</span>
        </div>

        <h1 className="text-xl sm:text-3xl font-semibold text-white mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-300 mb-6">
          We encountered an unexpected error. Please try again later or contact
          support if the issue persists.
        </p>

        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
          onClick={() => router.push('/')}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
