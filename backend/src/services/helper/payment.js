

export const calculatePurchasedCoins = ({ sc, gc, amount, amountPaid }) => {

  // Calculate proportion
  const proportion = amountPaid / amount;

  // Calculate SC and GC coins in proportion
  const scCoins = sc * proportion;
  const gcCoins = gc * proportion;

  return { scCoins, gcCoins };
};
