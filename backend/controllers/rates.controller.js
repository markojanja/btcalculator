const SYMBOL_PATTERN = /^[A-Z]{3}\/[A-Z]{3}$/;

// Proxies TwelveData so the API key stays on the server.
export const getRate = async (req, res, next) => {
  const { symbol } = req.query;

  if (typeof symbol !== "string" || !SYMBOL_PATTERN.test(symbol)) {
    return res.status(400).json({ message: "Invalid symbol." });
  }

  try {
    const url = new URL("https://api.twelvedata.com/exchange_rate");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("apikey", process.env.TWELVEDATA_API_KEY);

    const response = await fetch(url);
    const data = await response.json();
    const rate = parseFloat(data.rate);

    if (!response.ok || !Number.isFinite(rate)) {
      return res
        .status(502)
        .json({ message: `No rate available for ${symbol}.` });
    }

    return res.status(200).json({ symbol, rate });
  } catch (error) {
    next(error);
  }
};
