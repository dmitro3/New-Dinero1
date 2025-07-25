import { closeIconWhite, info } from '@/assets/svg';
import Image from 'next/image';
import style from '../style.module.scss';

const BonusCard = ({ bonus, flippedCard, handleFlip }) => {
  return (
    <div
      className={`relative ${style.cardsWidth}  h-[280px] md:h-[310px] perspective ${flippedCard ? style.flip : ''}`}
    >
      {/* Front Side */}
      <div
        className={`absolute w-full h-full bg-[rgb(var(--lb-blue-500))] rounded-lg overflow-hidden backface-hidden transform transition-transform duration-500 ${style.cardFront}`}
      >
        <Image
          src={bonus.imageUrl}
          alt="promotion-banner"
          className="w-full h-[80%] object-fit p-1 md:p-[6px] pb-0"
        />
        <div className="py-1 text-white flex justify-between mx-3 items-center h-[20%]">
          {/* <h2 className="font-bold">{bonus.description}</h2> */}
          <p
            dangerouslySetInnerHTML={{
              __html: bonus.description,
            }}
            className="text-xs md:text-sm"
          />
          <Image
            src={info}
            alt="information"
            onClick={() => handleFlip(bonus.id)}
            className="cursor-pointer"
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
            onClick={() => handleFlip(bonus.id)}
            className="cursor-pointer hover:bg-gray-500 rounded-full h-5 w-5"
          />
        </div>
        <div
          className={`p-4 text-white flex flex-col h-[calc(100%-2rem)] overflow-y-auto ${style.terms} scrollable-Content`}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: bonus.termsConditions,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BonusCard;
