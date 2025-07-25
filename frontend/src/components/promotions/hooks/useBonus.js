'use client';
import {
  bonus1,
  bonus2,
  bonus3,
  referralBonus,
  wageringBonus,
  welcomeBonus,
} from '@/assets/png';
import { getBonusService } from '@/services/getRequests';
import { useStateContext } from '@/store';
import { useEffect, useState } from 'react';

const fallbackImages = [
  welcomeBonus,
  bonus1,
  bonus2,
  bonus3,
  referralBonus,
  wageringBonus,
];

const useBonus = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const {
    state: { rightPanel },
  } = useStateContext();

  const formatData = (data = []) => {
    return data.map((item, index) => ({
      ...item,
      // imageUrl: item?.imageUrl || fallbackImages[index],
      imageUrl: fallbackImages[index],
    }));
  };

  const fetchBonus = async () => {
    setLoading(true);
    try {
      const response = await getBonusService();
      const formattedData = formatData(response?.data?.bonus?.rows || []);
      setData(formattedData);
    } catch (error) {
      console.error('Failed to fetch bonus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = (id) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const TAB_CONTROLS = (data || []).map((item) => ({
    label: item?.promotionTitle,
    value: item?.id,
  }));

  useEffect(() => {
    fetchBonus();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setActiveTab(data[0]?.id);
    }
  }, [data]);

  return {
    TAB_CONTROLS,
    loading,
    activeTab,
    setActiveTab,
    bonusData: data,
    flippedCards,
    handleFlip,
    rightPanel,
  };
};

export default useBonus;
