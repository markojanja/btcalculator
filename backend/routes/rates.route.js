import express from "express";

const router = express.Router();

// GET /rates?symbol=EUR/USD → { symbol, rate }
// The TwelveData key stays on the server; the browser never sees it.

const SYMBOL_PATTERN = /^[A-Z]{3,6}\/[A-Z]{3,6}$/;
const CACHE_MS = 60 * 1000; // free plan: 8 requests/minute, 800/day
const cache = new Map(); // symbol → { rate, time }

router.get("/rates", async (req, res, next) => {
  const symbol = String(req.query.symbol ?? "").toUpperCase();

  if (!SYMBOL_PATTERN.test(symbol)) {
    return res
      .status(400)
      .json({ message: "Invalid currency pair. Expected e.g. EUR/USD." });
  }

  const apiKey = process.env.TWELVEDATA_API_KEY;
  if (!apiKey) {
    return res
      .status(503)
      .json({ message: "Exchange rates are not configured on the server." });
  }

  const cached = cache.get(symbol);
  if (cached && Date.now() - cached.time < CACHE_MS) {
    return res.status(200).json({ symbol, rate: cached.rate });
  }

  try {
    const url = new URL("https://api.twelvedata.com/exchange_rate");
    url.search = new URLSearchParams({ symbol, apikey: apiKey }).toString();

    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const data = await response.json();

    // TwelveData reports most errors (bad symbol, rate limit) as HTTP 200
    // with { status: "error", message }.
    const rate = Number(data.rate);
    if (!response.ok || data.status === "error" || !Number.isFinite(rate)) {
      return res.status(502).json({
        message: `Couldn't get the ${symbol} rate: ${data.message ?? "rates service error"}`,
      });
    }

    cache.set(symbol, { rate, time: Date.now() });
    return res.status(200).json({ symbol, rate });
  } catch (error) {
    if (error.name === "TimeoutError") {
      return res
        .status(504)
        .json({ message: "The rates service took too long to answer." });
    }
    next(error);
  }
});

export default router;
