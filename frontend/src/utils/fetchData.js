import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Rates come from our backend (GET /rates), which holds the TwelveData key.
// Errors are shown as toasts by the axios interceptor.
const fetchRate = async (pair) => {
  const res = await axios.get(`${BACKEND_URL}/rates`, {
    params: { symbol: pair },
    withCredentials: true,
  });
  return res.data.rate;
};

export const fetchExchangeRate = async (pair, prevExchangeRate) => {
  try {
    return await fetchRate(pair);
  } catch {
    return prevExchangeRate; // keep the previous rate if the request fails
  }
};

export const fetchConversionRate = async (pair) => {
  try {
    return await fetchRate(pair);
  } catch {
    return null;
  }
};

export const getComments = async (baseURL, taskID, setter) => {
  if (!taskID) return;

  try {
    const res = await axios.get(`${baseURL}/tasks/${taskID}/comments/all`, {
      withCredentials: true,
    });
    setter(res.data);
  } catch (err) {
    console.error("Failed to fetch comments:", err);
  }
};
