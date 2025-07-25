import { truncateDecimals } from './utils';

export const formatValueWithK = (amount) => {
  let finalAmount;
  if (amount >= 1000000) {
    finalAmount = amount / 1000000;
    return finalAmount % 1 !== 0
      ? `${truncateDecimals(finalAmount, 2)}M`
      : `${finalAmount}M`;
  }

  if (amount < 1000) {
    finalAmount = amount;
    return finalAmount % 1 !== 0
      ? truncateDecimals(finalAmount, 2)
      : finalAmount;
  } else {
    finalAmount = amount / 1000;

    return finalAmount % 1 !== 0
      ? `${truncateDecimals(finalAmount, 2)}K`
      : `${finalAmount}K`;
  }
};
export const getAllSCValues = (wheelConfiguration) => {
  if (!wheelConfiguration || wheelConfiguration.length === 0) {
    return [];
  }
  return wheelConfiguration.map((wheel) => formatValueWithK(wheel.sc));
};

export const getAllGCValues = (wheelConfiguration) => {
  if (!wheelConfiguration || wheelConfiguration.length === 0) {
    return [];
  }
  return wheelConfiguration.map((wheel) => formatValueWithK(wheel.gc));
};
