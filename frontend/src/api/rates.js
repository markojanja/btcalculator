import { api } from "../lib/api";

// Rates are fetched through the backend so the API key never ships to the browser.
export const fetchRate = async (symbol) => {
  const res = await api.get("/rates", { params: { symbol } });
  return res.data.rate;
};

// Returns the factor that converts an amount in `from` into `to`
// (amountInTo = amountInFrom * rate). Falls back to inverting the reverse
// pair when the provider only quotes it one way round.
export const fetchConversionRate = async (from, to) => {
  if (from === to) return 1;

  try {
    return await fetchRate(`${from}/${to}`);
  } catch {
    return 1 / (await fetchRate(`${to}/${from}`));
  }
};
