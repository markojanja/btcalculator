import { format } from "date-fns";

// Parses a form value; empty input is NaN rather than 0 so it fails validation.
export const parseNumber = (value) => {
  if (value === "" || value === null || value === undefined) return NaN;
  return Number(value);
};

export const splitPair = (pair) => {
  const match = /^([A-Z]{3})\/([A-Z]{3})$/.exec(
    String(pair ?? "")
      .trim()
      .toUpperCase(),
  );
  return match ? { base: match[1], quote: match[2] } : null;
};

// Conventional pip sizes. Brokers can differ, so the UI keeps these editable.
const TWO_DECIMAL_QUOTES = ["JPY", "HUF"];

export const getPipSize = (pair) =>
  TWO_DECIMAL_QUOTES.includes(splitPair(pair)?.quote) ? 0.01 : 0.0001;

// A point is the smallest price step on 5/3-digit pricing: one tenth of a pip.
export const getPointSize = (pair) => getPipSize(pair) / 10;

// One pip move is worth pipSize * units in the quote currency;
// quoteToDeposit converts that into the account currency.
export const calculatePipValue = (pipSize, positionSize, quoteToDeposit) => {
  return pipSize * positionSize * quoteToDeposit;
};

// Result is in the pair's quote currency.
export const calculateProfitAndLoss = (
  open,
  close,
  tradeSize,
  contractSize,
  tradeType,
) => {
  if (tradeType === "BUY") {
    return (close - open) * (tradeSize * contractSize);
  }
  if (tradeType === "SELL") {
    return (open - close) * (tradeSize * contractSize);
  }

  return 0;
};

// Margin is held in the base currency of the pair. `price` converts base to
// quote, `conversion` is the base -> deposit rate for cross currencies.
const convertBaseToDeposit = (amount, { pair, deposit, price, conversion }) => {
  const { base, quote } = splitPair(pair);

  if (deposit === base) return amount;
  if (deposit === quote) return amount * price;
  return amount * conversion;
};

export const marginCalculationForex = ({
  contractSize,
  lotSize,
  leverage,
  ...currency
}) => {
  return convertBaseToDeposit((contractSize * lotSize) / leverage, currency);
};

export const marginCalculationCFD = ({
  contractSize,
  lotSize,
  marginPercent,
  ...currency
}) => {
  return convertBaseToDeposit(
    contractSize * lotSize * (marginPercent / 100),
    currency,
  );
};

// "money" swaps are quoted in the account currency; "points" and
// "percentage" swaps produce an amount in the pair's quote currency.
export const isSwapInQuoteCurrency = (calctype) => calctype !== "money";

const calculateSwapByMoney = (long, short, lots) => {
  return {
    long: long * lots,
    short: short * lots,
  };
};

const calculateSwapByPoints = (contractSize, pointSize, long, short, lots) => {
  return {
    long: long * pointSize * contractSize * lots,
    short: short * pointSize * contractSize * lots,
  };
};

// Percentage swaps are annual rates applied to the notional on a 360-day basis.
const calculateSwapByPercentage = (contractSize, lots, long, short, price) => {
  const notional = contractSize * lots * price;
  return {
    long: ((long / 100) * notional) / 360,
    short: ((short / 100) * notional) / 360,
  };
};

export const calculateDailySwap = (
  calctype,
  contractSize,
  pointSize,
  long,
  short,
  lots,
  price,
) => {
  if (calctype === "money") return calculateSwapByMoney(long, short, lots);
  if (calctype === "points")
    return calculateSwapByPoints(contractSize, pointSize, long, short, lots);
  if (calctype === "percentage")
    return calculateSwapByPercentage(contractSize, lots, long, short, price);
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// One rollover per weekday night the position is held, with the triple
// swap charged on `swapDay`. Works in local time so dates match the picker.
export const getDatesInRange = (startDate, endDate, swapDay) => {
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  const endDay = new Date(endDate);
  endDay.setHours(0, 0, 0, 0);
  const rollovers = [];

  while (currentDate < endDay) {
    const day = WEEKDAYS[currentDate.getDay()];

    if (day !== "Saturday" && day !== "Sunday") {
      rollovers.push({
        date: format(currentDate, "yyyy-MM-dd"),
        day,
        multiplier: day === swapDay ? 3 : 1,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return rollovers;
};

export const getTotalSwap = (rollovers, dailySwap) => {
  return rollovers.reduce(
    (total, rollover) => total + rollover.multiplier * dailySwap,
    0,
  );
};
