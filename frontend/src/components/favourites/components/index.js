'use client';
import Card from '@/common/components/custom-card/component';
import useFavourite from '../hooks/useFavourite';
// import { CASINO_TEMP_FAV_IMAGES } from '../constants';
import { favouriteImg } from '@/assets/png';
import Image from 'next/image';
// import BetsTable from '@/common/components/bets-table/components';
import CustomCardSkeleton from '@/common/components/custom-card-skeleton';
import CustomNoDataFound from '@/common/components/custom-noData';
import PaginationSection from '@/common/components/pagination-section';
import { isEmpty } from '@/lib/utils';
import { useStateContext } from '@/store';
const Favourites = () => {
  const { state } = useStateContext();
  const { t, data, loading, handleFavoriteGame, totalCount, loadMore } =
    useFavourite();
  const renderLoading = () => {
    return (
      <>
        <CustomCardSkeleton />
        {/* <CustomTableSkeleton /> */}
      </>
    );
  };
  return (
    <div className="bg-[hsl(var(--main-background))] pt-[0vw]">
      <div className=" h-20 flex  justify-between items-center bg-[hsl(var(--lb-blue-950))] mb-6">
        <h1 className="font-bold text-xl mx-8">{t('Favourites')}</h1>
        <Image
          src={favouriteImg}
          alt="favourite Image"
          className="h-20 w-40 mx-8"
        />
      </div>
      {/* <div className="flex flex-wrap space-x-1">
        {CASINO_TEMP_FAV_IMAGES.map((url, index) =>
          <Card iconUrl={url} key={index} handleFavoriteGame={handleFav} />
        )}

      </div> */}
      <div className="">
        {isEmpty(data) ? (
          <CustomNoDataFound message="No favourites yet, use the ❤️ to favourite games." />
        ) : (
          <div className="overflow-hidden mx-auto w-[100%] sm:w-[98%]">
            <div
              className={`grid grid-cols-3 sm:grid-cols-4  2xl:grid-cols-7 ${
                state.rightPanel
                  ? 'md:grid-cols-5 lg:grid-cols-7'
                  : 'md:grid-cols-4'
              } gap-2 sm:gap-3 mx-auto`}
            >
              {data.map((games) => (
                <Card
                  iconUrl={games?.CasinoFavoriteGames?.thumbnailUrl}
                  key={games?.CasinoFavoriteGames?.id}
                  handleFavoriteGame={() =>
                    handleFavoriteGame(
                      games?.CasinoFavoriteGames?.id,
                      games?.CasinoFavoriteGames?.isFavorite
                    )
                  }
                  isFavorite={games?.CasinoFavoriteGames?.isFavorite}
                  casinoGameId={games?.CasinoFavoriteGames?.casinoGameId}
                  id={games?.CasinoFavoriteGames?.id}
                  {...games}
                />
              ))}
            </div>
            <PaginationSection
              limit={data?.length}
              totalCount={totalCount}
              onShowMore={loadMore}
              loading={loading}
              renderLoading={renderLoading}
            />
          </div>
        )}
        <div className="my-6">{/* <BetsTable /> */}</div>
      </div>
    </div>
  );
};

export default Favourites;
