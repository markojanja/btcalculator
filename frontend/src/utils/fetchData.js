import axios from "axios";

export const fetchExchangeRate = async (pair, API_KEY, prevExchangeRate) => {
  try {
    const res = await axios.get(
      `https://api.twelvedata.com/exchange_rate?symbol=${pair}&apikey=${API_KEY}`
    );
    if (res.data.rate) {
      return parseFloat(res.data.rate);
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return prevExchangeRate; // Return previous rate in case of failure
  }
};

export const fetchConversionRate = async (pair, API_KEY) => {
  try {
    const res = await axios.get(
      `https://api.twelvedata.com/exchange_rate?symbol=${pair}&apikey=${API_KEY}`
    );
    if (res.data.rate) {
      return parseFloat(res.data.rate);
    }
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    return null; // Return null if the request fails
  }
};
