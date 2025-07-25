'use client';
import CustomCardSkeleton from '@/common/components/custom-card-skeleton';
import Card from '@/common/components/custom-card/component';
import CustomNoDataFound from '@/common/components/custom-noData';
// import CustomTableSkeleton from '@/common/components/custom-table-skeleton';
import { isEmpty } from '@/lib/utils';
import useCategory from '../hooks/useCategory';
import useCategoryGames from '../hooks/useCategoryGames';
import PaginationSection from '@/common/components/pagination-section';
import BetsTable from '@/common/components/bets-table/components';
import { useStateContext } from '@/store';
import Image from 'next/image';
const Category = () => {
  const { state } = useStateContext();
  const { providerLoading, providerData } = useCategory();
  const {
    formateData,
    gameLoading,
    handleFavoriteGame,
    totalCount,
    defaultLimit,
    loadMore,
  } = useCategoryGames();
  const loading = gameLoading || providerLoading;

  const renderLoading = () => {
    return (
      <>
        <CustomCardSkeleton rows={defaultLimit} />
        {/* <CustomTableSkeleton /> */}
      </>
    );
  };
  return (
    <div className="mb-6 bg-[hsl(var(--main-background))]">
      <div className="font-bold text-2xl h-20 flex  justify-between items-center bg-[hsl(var(--lb-purple-950))] mb-6">
        <h1 className="font-bold text-2xl mx-8">{providerData?.name?.EN}</h1>
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAACgCAMAAAAfOfHZAAAAk1BMVEUAAAAdOGcULVocOGgbOGgLHEAcOGgKHUEdOWccOGgcOGgcOGcIGEAbNWUJHkAbOWYKHEAcOGkcOWcKHUEhOmsLHUEcOWgLHEEfO2UcOGoIIEAcN2kdOmUKHUAgOmUeOWQeOmULHUIMHEELHUIeOmULHUAKHUAJHEANHUALHkEKHUIKHUANH0QLHUEeOmYPI0gYMFgGmTr4AAAALXRSTlMAIBDfYL/v359AgHAgMHBQQL+QgB/vz8+/fyCvYJ9gQK+fkI+AYFBvUM+vsK8NSpbCAAAEeUlEQVR42u3cjVraMBQG4K9Jfyil/A4Qmduc07mfc/T+r24dPptYIzYlhTTJewE+z2cO4eS0BEEQBEEQBEEQBEEQBEEQBEEQBEEQBMHbNqs5fBUzs4zgp4IrsoSXct7ZYCeKhz5VgeAngzyer1JmTgX8IblmAn9s+aXUp7ovPF54TPiFIawi7sZX64wqWfJzMRUwK+Z9W3RCCLQgFgnVJOMRzIkkP+uq3YlTLqBrmpBSMoUhQvK+CJ2QzKloE10tu4MRc943QydirhTQMErooGsTxb/hFyQ6sdX9x35f0juyWxyr5BqBDkSaf1vcUAM3ONKMa3J0INb7EhVramQ9MhI+XUl+UqADUmtDGWXUUHZc+lKms3kcARjyzgA1JveVon12tUwY+yruZMfL5yn/t4ojvGdNGtZmux2YJDYzrhlMcNANabkxln7LPDdb7yryUPxb0jSGKXkOgwSrpe0+8GrLEawkUlaSeNM1aUtgp4lkhbTAW+6ohSkslQ/qqz+LBd6UEbmz9BURz/aSFwIHTImcWvq/iqYDsoTIsaWvpM3a2xG1ZPWsfcg7MQ4bU0sLWKxsNitIiFys+1mTM5MgcrLuC66UOGxKrd3BYqJJ1S+otTFsNuS0xDt+UmtX6LuEWluj7zJqLUPf0RHQdyF8CO9heK83vDWRm819E1fU2i/03ZjIyTNtI/dUcXCQ9cTTI+0TT4cZzSzcPNF2XPeXcEAPR9f5sERzbj20KAy+yZP0rLctuVKcc+nvcS6RNPqyctKn+V2V3Wj4yyVpys621YsV78Tna/BvcS5bNh0eX0nLV5zLhs2HFz/6MbPecAfhITJbP/DlfFAZ7my5k/C4zOzMHqWsFMNo+oaVvxY4pZw1wne9630VOCkhTxMetxm9YznGqUXq9AOYdvmbDkoucXpixiobmDZ4fDgQfYrzmLPKHIZJ5scHy6JXhqyyimDSZ66o8icLgXMqWEUaTT/gfx4fHx4eqJKtr8b355/TllKZvoQ5KddZc7GHetNPY5gy4Vfs+WF7wd1u+l+4bgVr5KyWw4iIX/kEa8SsNoERH22uesTc6Y5/wXUXsEf8nHcSRVH+pBQ+VP1e+BL7fKj65/AxOrDiui+wSNzl7SIRs9VX98Tq7F0dnVLYJO7yZhWpmBfYZBdeCnThM7/yGTbp8hK9AddJWEWsXmT3quorkUA3JvyKPzcVHl/1ovgiuZX04mOEMxIp1xXQUqR8BPkN2uxpbQd8pAsBfXYc6PSz23OCPPZA940NaF75VlV9JFmfNWfII6v+I3N/l/7Yqr/gNixpKQuuSwU0sCECTdnT2go25ANOrzxyjBH1ObyqtfUmvKLqvQmvGmN4E15V9d6EVzyX9ia86rm0N+FVz6V9Ca9qbb0JrzrQuRVeLJKMem3Z9pL5UUJOuG4R//uSHKH/5u+CHLLQXHdyitbaj5yp+RYX7l6TYxKNhSfnCDQ1Jucs0JQj3/Dt6t6x7U7vt+vkoBA+hA/hQ/gQPoQP4UP4EN41IXwIH8KH8H8AYl69DvUDgU4AAAAASUVORK5CYII="
          alt="third slots"
          className="h-20 w-30 mx-8"
          width={100}
          height={50}
        />
      </div>
      <div className=" mb-3">
        {isEmpty(formateData[0]) && !loading ? (
          <CustomNoDataFound />
        ) : (
          <div className="overflow-hidden mx-auto w-[100%] sm:w-[98%]">
            <div
              className={`grid grid-cols-3 sm:grid-cols-4  2xl:grid-cols-7 ${
                state.rightPanel
                  ? 'md:grid-cols-5 lg:grid-cols-7'
                  : 'md:grid-cols-4'
              } gap-2 sm:gap-3 mx-auto`}
            >
              {formateData?.map((game) => (
                <Card
                  key={game.id}
                  iconUrl={game?.thumbnailUrl}
                  casinoGameId={game?.casinoGameId}
                  isFavorite={game?.isFavorite}
                  handleFavoriteGame={() =>
                    handleFavoriteGame(game?.id, game?.isFavorite)
                  }
                  {...game}
                />
              ))}
            </div>
            <PaginationSection
              limit={formateData?.length}
              totalCount={totalCount}
              onShowMore={loadMore}
              loading={loading}
              renderLoading={renderLoading}
            />
          </div>
        )}
      </div>
      {/* <CategoryTable /> */}
      <BetsTable />
    </div>
  );
};
export default Category;
