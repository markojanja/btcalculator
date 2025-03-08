import { formatPipValue } from "./helpers";

export const calculatePipValue = (
  pipSize,
  positionSize,
  exchangeRate,
  conversionRate,
  showConversion,
  isJPY
) => {
  let pipValue = (pipSize * positionSize) / exchangeRate;
  pipValue = formatPipValue(parseFloat(pipValue));

  if (showConversion) {
    pipValue = isJPY
      ? parseFloat(pipValue * conversionRate)
      : parseFloat(pipValue / conversionRate);
  }

  return formatPipValue(pipValue);
};

export const marginCalculationForex = (contractSize, lotSize, price, leverage) => {
  return parseFloat((contractSize * lotSize * price) / leverage);
};
export const marginCalculationCFD = (contractSize, lotSize, price, margin) => {
  return parseFloat(contractSize * lotSize * price * (margin / 100));
};

const calculateSwapByMoney = (long, short, lots) => {
  return {
    long: parseFloat(long * lots),
    short: parseFloat(short * lots),
  };
};

const calculateSwapByPoints = (contractSize, pipSize, long, short, lots) => {
  return {
    long: parseFloat((long * contractSize * lots) / (10 / pipSize)),
    short: parseFloat((short * contractSize * lots) / (10 / pipSize)),
  };
};

const calculateSwapByPercentage = (contractSize, lots, long, short, price) => {
  return {
    long: parseFloat(((long * contractSize * price) / (100 * 360)) * lots),
    short: parseFloat(((short * contractSize * price) / (100 * 360)) * lots),
  };
};

export const calculateDailySwap = (calctype, contractSize, pipSize, long, short, lots, price) => {
  if (calctype === "money") return calculateSwapByMoney(long, short, lots);
  if (calctype === "points") return calculateSwapByPoints(contractSize, pipSize, long, short, lots);
  if (calctype === "percentage")
    return calculateSwapByPercentage(contractSize, lots, long, short, price);
};

export const getDatesInRange = (startDate, endDate, swapDay) => {
  let currentDate = new Date(startDate);
  const endDay = new Date(endDate);
  const datesInRange = [];

  while (currentDate < endDay) {
    const dayOfWeek = currentDate.toLocaleString("en-US", { weekday: "long" });

    if (dayOfWeek === "Saturday" || dayOfWeek === "Sunday") {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    const value = dayOfWeek === swapDay ? 3 : 1;

    const formattedDate = currentDate.toISOString().split("T")[0];

    datesInRange.push({ date: formattedDate, [dayOfWeek]: value });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesInRange;
};

export const getTotalSwap = (array, dailySwap) => {
  let total = 0;
  array.forEach((entry) => {
    const values = Object.values(entry)[1];
    total = total + values * parseFloat(dailySwap);
  });
  return total;
};
