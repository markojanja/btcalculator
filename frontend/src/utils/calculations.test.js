import { describe, expect, it } from "vitest";
import {
  calculateDailySwap,
  calculatePipValue,
  calculateProfitAndLoss,
  getDatesInRange,
  getPipSize,
  getPointSize,
  getTotalSwap,
  marginCalculationCFD,
  marginCalculationForex,
  parseNumber,
  splitPair,
} from "./calculations";

describe("splitPair", () => {
  it("splits a valid pair", () => {
    expect(splitPair("EUR/USD")).toEqual({ base: "EUR", quote: "USD" });
    expect(splitPair(" eur/jpy ")).toEqual({ base: "EUR", quote: "JPY" });
  });

  it("rejects malformed symbols", () => {
    expect(splitPair("EURUSD")).toBeNull();
    expect(splitPair("")).toBeNull();
    expect(splitPair(undefined)).toBeNull();
  });
});

describe("parseNumber", () => {
  it("treats empty input as invalid instead of zero", () => {
    expect(parseNumber("")).toBeNaN();
    expect(parseNumber(null)).toBeNaN();
    expect(parseNumber("1.5")).toBe(1.5);
    expect(parseNumber(0)).toBe(0);
  });
});

describe("pip and point sizes", () => {
  it.each([
    ["EUR/USD", 0.0001],
    ["USD/JPY", 0.01],
    ["EUR/HUF", 0.01],
  ])("%s has pip size %d", (pair, size) => {
    expect(getPipSize(pair)).toBe(size);
  });

  it("uses a tenth of a pip as the point size", () => {
    expect(getPointSize("EUR/USD")).toBeCloseTo(0.00001, 10);
    expect(getPointSize("USD/JPY")).toBeCloseTo(0.001, 10);
  });
});

describe("calculatePipValue", () => {
  it("is 10 USD per standard lot of EUR/USD on a USD account", () => {
    expect(calculatePipValue(0.0001, 100000, 1)).toBeCloseTo(10, 10);
  });

  it("converts quote currency into the account currency", () => {
    // EUR account, USD -> EUR at 1 / 1.1
    expect(calculatePipValue(0.0001, 100000, 1 / 1.1)).toBeCloseTo(9.0909, 4);
    // USD/JPY on a USD account: 1000 JPY at 150 JPY per USD
    expect(calculatePipValue(0.01, 100000, 1 / 150)).toBeCloseTo(6.6667, 4);
  });
});

describe("calculateProfitAndLoss", () => {
  it("returns profit in quote currency for a BUY", () => {
    expect(
      calculateProfitAndLoss(1.1, 1.11, 1, 100000, "BUY"),
    ).toBeCloseTo(1000, 6);
  });

  it("inverts the sign for a SELL", () => {
    expect(
      calculateProfitAndLoss(1.1, 1.11, 1, 100000, "SELL"),
    ).toBeCloseTo(-1000, 6);
  });

  it("converts to a base-currency account by multiplying by the quote -> base rate", () => {
    // Regression: the old code multiplied by the EUR/USD rate instead of dividing.
    const pnlInUsd = calculateProfitAndLoss(1.1, 1.11, 1, 100000, "BUY");
    const usdToEur = 1 / 1.11;
    expect(pnlInUsd * usdToEur).toBeCloseTo(900.9, 1);
  });

  it("returns 0 for an unknown trade type", () => {
    expect(calculateProfitAndLoss(1.1, 1.11, 1, 100000, "HOLD")).toBe(0);
  });
});

describe("marginCalculationForex", () => {
  const base = {
    contractSize: 100000,
    lotSize: 1,
    leverage: 100,
    pair: "EUR/USD",
    price: 1.1,
    conversion: NaN,
  };

  it("needs no conversion when the account is in the base currency", () => {
    expect(marginCalculationForex({ ...base, deposit: "EUR" })).toBeCloseTo(
      1000,
      6,
    );
  });

  it("uses the price when the account is in the quote currency", () => {
    expect(marginCalculationForex({ ...base, deposit: "USD" })).toBeCloseTo(
      1100,
      6,
    );
  });

  it("uses the base -> deposit rate for cross currencies", () => {
    expect(
      marginCalculationForex({ ...base, deposit: "GBP", conversion: 0.85 }),
    ).toBeCloseTo(850, 6);
  });
});

describe("marginCalculationCFD", () => {
  const base = {
    contractSize: 100000,
    lotSize: 1,
    marginPercent: 5,
    pair: "EUR/USD",
    price: 1.1,
    conversion: NaN,
  };

  it("does not return 0 when no conversion rate is set (regression)", () => {
    expect(marginCalculationCFD({ ...base, deposit: "EUR" })).toBeCloseTo(
      5000,
      6,
    );
  });

  it("converts with the price for a quote-currency account", () => {
    expect(marginCalculationCFD({ ...base, deposit: "USD" })).toBeCloseTo(
      5500,
      6,
    );
  });

  it("applies the cross rate exactly once (regression)", () => {
    expect(
      marginCalculationCFD({ ...base, deposit: "GBP", conversion: 0.85 }),
    ).toBeCloseTo(4250, 6);
  });

  it("matches forex margin at the equivalent leverage", () => {
    const cfd = marginCalculationCFD({ ...base, deposit: "USD" });
    const forex = marginCalculationForex({
      ...base,
      leverage: 20,
      deposit: "USD",
    });
    expect(cfd).toBeCloseTo(forex, 6);
  });
});

describe("calculateDailySwap", () => {
  it("multiplies money swaps by lots", () => {
    expect(calculateDailySwap("money", 100000, 0.00001, -3, 1, 2, 0)).toEqual({
      long: -6,
      short: 2,
    });
  });

  it("values points swaps with the point size, not the pip size (regression)", () => {
    const swap = calculateDailySwap("points", 100000, 0.00001, -5, 2, 1, 0);
    expect(swap.long).toBeCloseTo(-5, 10);
    expect(swap.short).toBeCloseTo(2, 10);
  });

  it("applies percentage swaps annually on a 360-day basis", () => {
    const swap = calculateDailySwap("percentage", 100000, 0, 2, -1, 1, 1.1);
    expect(swap.long).toBeCloseTo((0.02 * 110000) / 360, 10);
    expect(swap.short).toBeCloseTo((-0.01 * 110000) / 360, 10);
  });
});

describe("getDatesInRange / getTotalSwap", () => {
  // 2026-10-12 is a Monday.
  const monday = new Date(2026, 9, 12);
  const nextMonday = new Date(2026, 9, 19);

  it("counts one rollover per weekday night with a triple on the swap day", () => {
    const rollovers = getDatesInRange(monday, nextMonday, "Wednesday");

    expect(rollovers.map((r) => r.date)).toEqual([
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
    ]);
    expect(rollovers.map((r) => r.multiplier)).toEqual([1, 1, 3, 1, 1]);
    expect(getTotalSwap(rollovers, -2)).toBe(-14);
  });

  it("charges nothing for a position opened and closed the same day", () => {
    expect(getDatesInRange(monday, monday, "Wednesday")).toEqual([]);
  });

  it("charges nothing over a weekend", () => {
    const saturday = new Date(2026, 9, 17);
    expect(getDatesInRange(saturday, nextMonday, "Wednesday")).toEqual([]);
  });
});
