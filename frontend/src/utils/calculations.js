export const marginCalculationForex = (contractSize, lotSize, price, leverage) => {
  return (contractSize * lotSize * price) / leverage;
};
export const marginCalculationCFD = (contractSize, lotSize, price, margin) => {
  return contractSize * lotSize * price * (margin / 100);
};
