export const marginCalculationForex = (contractSize, lotSize, price, leverage) => {
  return parseFloat((contractSize * lotSize * price) / leverage);
};
export const marginCalculationCFD = (contractSize, lotSize, price, margin) => {
  return parseFloat(contractSize * lotSize * price * (margin / 100));
};
