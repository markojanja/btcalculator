import { useState } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import help from "../content/help/swap.md?raw";
import {
  CURRENCIES,
  CURRENCY_PAIRS,
  TRADE_TYPES,
} from "../constants/currencies";
import { fetchConversionRate } from "../api/rates";
import { formatDate } from "../lib/format";
import {
  calculateDailySwap,
  getDatesInRange,
  getPointSize,
  getTotalSwap,
  isSwapInQuoteCurrency,
  parseNumber,
  splitPair,
} from "../utils/calculations";
import { NumberField, SelectField } from "../components/form/fields";
import DatePicker from "../components/DatePicker";
import ToolPage from "../components/ToolPage";

const SWAP_TYPES = ["money", "points", "percentage"];
const WORKING_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SectionTitle = ({ children }) => (
  <CardDescription className="flex items-start text-md">{children}</CardDescription>
);

const SwapResult = ({ result }) => (
  <Card className="w-full lg:w-1/3">
    <CardContent className="flex flex-col items-start">
      <h4>Symbol: {result.symbol}</h4>
      <h4>Calculation Type: {result.activeCalculation}</h4>
      <h4>3-day Swap: {result.swapDay}</h4>
      <h4>Asset Price: {result.assetPrice}</h4>
      <h4>Lots: {result.lotsTraded}</h4>
      <h4>
        Daily swap {result.dailySwap.toFixed(3)} {result.deposit}{" "}
        {result.dailySwap < 0 ? "is charged" : "is paid"}
      </h4>
      <h4 className="text-left font-semibold">
        Total swaps: {result.total.toFixed(3)} {result.deposit}{" "}
        {`from ${formatDate(result.openDate)} to ${formatDate(result.closeDate)} `}
        {result.total < 0 ? "is being charged" : "is paid"}
      </h4>
    </CardContent>
  </Card>
);

const SwapCalculator = () => {
  const [symbol, setSymbol] = useState("EUR/USD");
  const [contractSize, setContractSize] = useState(100000);
  const [pointSize, setPointSize] = useState(0.00001);
  const [activeCalculation, setActiveCalculation] = useState("money");
  const [activeDay, setActiveDay] = useState("Wednesday");
  const [long, setLong] = useState("");
  const [short, setShort] = useState("");
  const [deposit, setDeposit] = useState("USD");
  const [assetPrice, setAssetPrice] = useState("");
  const [lotsTraded, setLotsTraded] = useState("");
  const [tradeType, setTradeType] = useState("BUY");
  const [openDate, setOpenDate] = useState(null);
  const [closeDate, setCloseDate] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSymbolSelect = (value) => {
    setSymbol(value);
    setPointSize(getPointSize(value));
  };

  const handleCalculateSwap = async () => {
    setResult(null);
    setError("");

    if (!openDate || !closeDate) {
      setError("Select both an open and a close date.");
      return;
    }
    if (closeDate <= openDate) {
      setError("Close date must be after the open date.");
      return;
    }

    const numbers = {
      contractSize: parseNumber(contractSize),
      pointSize: parseNumber(pointSize),
      long: parseNumber(long),
      short: parseNumber(short),
      lots: parseNumber(lotsTraded),
      price: activeCalculation === "percentage" ? parseNumber(assetPrice) : 0,
    };
    if (!Object.values(numbers).every(Number.isFinite)) {
      setError("Fill in all swap and trade fields with numbers.");
      return;
    }

    const swapCalculation = calculateDailySwap(
      activeCalculation,
      numbers.contractSize,
      numbers.pointSize,
      numbers.long,
      numbers.short,
      numbers.lots,
      numbers.price,
    );
    const dailySwapInSwapCurrency =
      tradeType === "BUY" ? swapCalculation.long : swapCalculation.short;

    // Points and percentage swaps come out in the quote currency.
    let rate = 1;
    const { quote } = splitPair(symbol);
    if (isSwapInQuoteCurrency(activeCalculation) && quote !== deposit) {
      try {
        rate = await fetchConversionRate(quote, deposit);
      } catch {
        setError(`Could not fetch the ${quote}/${deposit} conversion rate.`);
        return;
      }
    }

    const dailySwap = dailySwapInSwapCurrency * rate;
    const rollovers = getDatesInRange(openDate, closeDate, activeDay);

    setResult({
      symbol,
      activeCalculation,
      swapDay: activeDay,
      lotsTraded,
      assetPrice,
      tradeType,
      deposit,
      openDate,
      closeDate,
      dailySwap,
      total: getTotalSwap(rollovers, dailySwap),
    });
  };

  return (
    <ToolPage
      title="Swap Calculator"
      help={help}
      result={result && <SwapResult result={result} />}
    >
      <SectionTitle>Symbol settings</SectionTitle>
      <FieldGroup className="flex flex-row gap-1 lg:gap-2">
        <SelectField
          label="Symbol"
          value={symbol}
          onChange={handleSymbolSelect}
          options={CURRENCY_PAIRS}
          placeholder="Select symbol"
        />
        <NumberField
          label="Contract Size"
          placeholder="set contract size..."
          value={contractSize}
          onChange={setContractSize}
        />
        <NumberField
          label="Point size"
          placeholder="set point size..."
          value={pointSize}
          onChange={setPointSize}
        />
      </FieldGroup>

      <SectionTitle>Swap settings</SectionTitle>
      <FieldGroup className="flex flex-row">
        <SelectField
          label="Calculation Type"
          value={activeCalculation}
          onChange={setActiveCalculation}
          options={SWAP_TYPES}
        />
        <SelectField
          label="3-day swap"
          value={activeDay}
          onChange={setActiveDay}
          options={WORKING_DAYS}
        />
      </FieldGroup>
      <FieldGroup className="flex flex-row">
        <NumberField
          label="Long swap"
          placeholder="set long swap..."
          value={long}
          onChange={setLong}
        />
        <NumberField
          label="Short swap"
          placeholder="set short swap..."
          value={short}
          onChange={setShort}
        />
      </FieldGroup>

      <SectionTitle>Trade settings</SectionTitle>
      <FieldGroup className="flex flex-row">
        <SelectField
          label="Account Currency"
          value={deposit}
          onChange={setDeposit}
          options={CURRENCIES}
        />
        <SelectField
          label="Trade Type"
          value={tradeType}
          onChange={setTradeType}
          options={TRADE_TYPES}
        />
      </FieldGroup>
      <FieldGroup className="flex flex-row">
        <NumberField
          label="Asset Price"
          placeholder="set asset price..."
          value={assetPrice}
          onChange={setAssetPrice}
        />
        <NumberField
          label="Lot Size"
          placeholder="set lot size..."
          value={lotsTraded}
          onChange={setLotsTraded}
        />
      </FieldGroup>
      <FieldGroup className="flex flex-row">
        <Field>
          <Label>open date</Label>
          <DatePicker
            value={openDate}
            onChange={setOpenDate}
            placeholder="open date"
          />
        </Field>
        <Field>
          <Label>close date</Label>
          <DatePicker
            value={closeDate}
            onChange={setCloseDate}
            placeholder="close date"
          />
        </Field>
      </FieldGroup>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleCalculateSwap}>Calculate</Button>
    </ToolPage>
  );
};

export default SwapCalculator;
