'use client';

import CustomListSkeleton from '@/common/components/custom-list-skeleton';
import HomeCustomCardSkeleton from '@/common/components/home-custom-card-skeleton';
import { isEmpty } from '@/lib/utils';
import { getAccessToken } from '@/services/storageUtils';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import useHome from '../hooks/useHome';
import Banner from './banner';

const CasinoSection = dynamic(() => import('./CasinoSection'), {
  ssr: false,
  // loading: () => <HomeCustomCardSkeleton rows={8} />,
});

// Dynamically load BetsTable for better performance
const BetsTable = dynamic(
  () => import('@/common/components/bets-table/components'),
  {
    ssr: false,
    loading: () => <CustomListSkeleton />,
  }
);
const RecentBigWin = dynamic(
  () => import('@/components/Home/components/recent-big-win'),
  {
    ssr: false,
    loading: () => (
      <HomeCustomCardSkeleton
        className="w-[89px] h-[89px] md:w-[99px] md:h-[99px]"
        rows={9}
      />
    ),
  }
);
function HomePage() {
  const { gameData, gameLoading } = useHome();
  const token = getAccessToken();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [token]);

  return (
    <div className="flex w-full flex-none flex-col bg-[hsl(var(--main-background))]">
      <Banner />
      
      {gameLoading && <HomeCustomCardSkeleton rows={8} />}

      {gameData?.map(
        (game) =>
          !isEmpty(game?.CasinoGames) &&
          game?.CasinoGames?.length > 7 && (
            <section key={game?.id} className="casino-section">
              <CasinoSection
                categoryId={game?.id}
                categoryName={game?.name?.EN}
                casinoGames={game?.CasinoGames}
              />
            </section>
          )
      )}
      <div className="mt-5 hidden md:block">{isClient && <BetsTable />}</div>
      <div className="my-3">
        <RecentBigWin />
      </div>
    </div>
    
  );
}

export default HomePage;
