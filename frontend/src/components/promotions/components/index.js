'use client';
import { Skeleton } from '@/components/ui/skeleton';
import PromotionBanner from './promotion-banner';
import style from './style.module.scss';
import BonusCard from './bonus-cards';
import PromotionCard from './promotion-card';
import useBonus from '../hooks/useBonus';
import usePromotionCard from '../hooks/usePromotionCard';
// const promotions = [
//   {
//     id: 9,
//     title: { EN: 'content' },
//     slug: 'promotionSloug',
//     image: bonus1,
//     mobileImage: null,
//     description: 'description',
//     category: 2,
//     isActive: true,
//   },
//   {
//     id: 8,
//     title: { EN: 'content' },
//     slug: 'slug-for-demo1',
//     image: bonus1,
//     mobileImage: null,
//     description: 'description ',
//     category: 2,
//     isActive: true,
//   },
// ];
const Promotions = () => {
  const { bonusData, loading, flippedCards, handleFlip, rightPanel } =
    useBonus();
  const gridClass = rightPanel ? style.threeColumns : style.twoColumns;
  const {promoCardsData,promoCardsLoading,promoFlippedCards,handlePromoFlip}=usePromotionCard();
  
  const renderLoading = () => {
    const columnCount = rightPanel ? 4 : 2;
    return (
      <div className={`${gridClass} ${style.cardsView}`}>
        {Array(6)
          .fill(0)
          .map((_, idx) => (
            <Skeleton
              key={idx}
              className={`w-full ${
                columnCount === 4 ? 'h-[250px]' : 'h-[300px]'
              } bg-[rgb(var(--lb-blue-300))] rounded-lg`}
            />
          ))}
      </div>
    );
  };
  return (
    <div className={`${style.wrapCenter} bg-[hsl(var(--main-background))] p-6`}>
      <h1 className="text-white text-2xl font-bold mb-6">Promotions</h1>
      <PromotionBanner />

      {loading ? (
        renderLoading()
      ) : (
        <div className={`w-full overflow-x-auto ${style.scrollbarcontainer}`}>
          <div className="flex w-max gap-5 ">
            {bonusData.map((bonus) => (
              <BonusCard
                key={bonus.id}
                bonus={bonus}
                flippedCard={flippedCards.includes(bonus.id)}
                handleFlip={handleFlip}
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}
      {promoCardsLoading?(
        renderLoading()
      ):(
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ${rightPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} ${rightPanel ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}  gap-6 w-full mt-10`}>
        {promoCardsData.map((promo) => (
          <PromotionCard key={promo.id} promotion={promo} promoFlippedCard={promoFlippedCards?.includes(promo.id)} handlePromoFlip={handlePromoFlip}/>
        ))}
      </div>
      )}
    </div>
  );
};

export default Promotions;
