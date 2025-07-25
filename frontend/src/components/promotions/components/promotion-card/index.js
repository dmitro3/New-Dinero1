import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { bonus1 } from '@/assets/png';
import { closeIconWhite, info } from '@/assets/svg';
import style from '../style.module.scss';

const PromotionCard = ({ promotion,promoFlippedCard,handlePromoFlip }) => {
  const router = useRouter();
  
  
  const handleNavigate = () => {
    if (promotion?.slug) {
      router.push(`/${promotion?.slug}`);
    }
  };

    return (
      <div
        className={`relative w-full max-w-[400px]  h-[280px] md:h-[310px] perspective ${promoFlippedCard ? style.flip : ''}`}
      >
        {/* Front Side */}
        <div
          className={`absolute w-full h-full bg-[rgb(var(--lb-blue-500))] rounded-lg overflow-hidden backface-hidden transform transition-transform duration-500 ${style.cardFront}`}
        >
          <Image
            src={promotion?.image||bonus1}
            alt="promotion-card"
            width={200}
            height={200}
            className="w-full h-[80%] object-fit p-1 md:p-[6px] pb-0"
            onClick={()=>handleNavigate()}
          />
          <div className=" text-white flex justify-between mx-3 items-center h-[10%]">
            <div className="mt-4">
             <h2 className="font-bold text-xl">{promotion?.title?.EN||''}</h2> 
             <p className="text-white text-xs leading-3">{promotion?.description?.EN||''}</p>
            </div>
            
            <Image
              src={info}
              alt="information"
              onClick={() => handlePromoFlip(promotion?.id)}
              className="cursor-pointer mt-8"
            />
          </div>
        </div>
  
        {/* Back Side */}
        <div
          className={`absolute w-full h-full bg-[rgb(var(--lb-blue-600))] rounded-lg transform transition-transform duration-500 ${style.cardBack}`}
        >
          <div className="flex justify-between items-center p-3 bg-[rgb(var(--lb-blue-500))] rounded-t-lg">
            <h1 className="font-bold text-white">Terms and Conditions</h1>
            <Image
              src={closeIconWhite}
              alt="close"
              onClick={() => handlePromoFlip(promotion?.id)}
              className="cursor-pointer hover:bg-gray-500 rounded-full h-5 w-5"
            />
          </div>
          <div
            className={`p-4 text-white flex flex-col h-[calc(100%-2rem)] overflow-y-auto ${style.terms} scrollable-Content`}
          >
           <p
            dangerouslySetInnerHTML={{
              __html: promotion?.content?.EN||'',
            }}
            className="text-xs md:text-sm"
          />
          </div>
        </div>
      </div>
    );
};

export default PromotionCard;
