import { useState,useEffect } from 'react';

import { getPromotions } from '@/services/getRequests';

function usePromotionCard(){
    const [promoCardsData, setPromoCardsData] = useState([]);
    const [promoCardsLoading, setPromoCardsLoading] = useState(false);
    const [promoCardsError, setPromoCardsError] = useState(null);
    const [promoFlippedCards, setPromoFlippedCards] = useState([]);

    const getCards=async()=>{
        setPromoCardsLoading(true);
        setPromoCardsError(null);
        try {
            const response = await getPromotions({ });
            setPromoCardsData(response?.data?.promotions?.rows);
        } catch (err) {
            setPromoCardsError(err.message);
        } finally{
            setPromoCardsLoading(false);
        }
    };

    const handlePromoFlip = (id) => {
        setPromoFlippedCards((prev) =>
            prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
          );
      };

    useEffect(() => {
        getCards();
      }, []);

    return{
        promoCardsData,
        promoCardsLoading,
        promoCardsError,
        promoFlippedCards,
        handlePromoFlip
    };
}

export default usePromotionCard;