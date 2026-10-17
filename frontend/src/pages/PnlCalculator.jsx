import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import help from "../content/help/pnl.md?raw";
import {
  CURRENCIES,
  CURRENCY_PAIRS,
  TRADE_TYPES,
} from "../constants/currencies";
import { fetchConversionRate } from "../api/rates";
import {
  calculateProfitAndLoss,
  parseNumber,
  splitPair,
} from "../utils/calculations";
import {
  NumberField,
  SelectField,
  TextField,
} from "../components/form/fields";
import ToolPage from "../components/ToolPage";

const PnlCalculator = () => {
  const [currencyPair, setCurrencyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [openPrice, setOpenPrice] = useState("");
  const [closePrice, setClosePrice] = useState("");
  const [tradeSize, setTradeSize] = useState(1);
  const [tradeType, setTradeType] = useState("BUY");
  const [contractSize, setContractSize] = useState(100000);
  const [conversionRate, setConversionRate] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [pnl, setPnl] = useState(null);
  const [error, setError] = useState("");

  const quote = splitPair(currencyPair)?.quote ?? "quote";

  const calculatePnl = async () => {
    setPnl(null);
    setError("");

    const pair = splitPair(currencyPair);
    if (!pair) {
      setError("Symbol must be in the format EUR/USD.");
      return;
    }

    const [open, close, lots, contract] = [
      openPrice,
      closePrice,
      tradeSize,
      contractSize,
    ].map(parseNumber);
    if (![open, close, lots, contract].every(Number.isFinite)) {
      setError("Fill in contract size, open price, close price and lots.");
      return;
    }

    // PnL comes out in the quote currency; convert it to the account currency.
    const pnlInQuote = calculateProfitAndLoss(
      open,
      close,
      lots,
      contract,
      tradeType,
    );

    let rate = 1;
    if (pair.quote !== depositCurrency) {
      if (editMode && conversionRate !== "") {
        rate = parseNumber(conversionRate);
      } else {
        try {
          rate = await fetchConversionRate(pair.quote, depositCurrency);
        } catch {
          setError(
            `Could not fetch ${pair.quote}/${depositCurrency}. Enter it manually in edit mode.`,
          );
          return;
        }
      }
    }

    if (!Number.isFinite(rate) || rate <= 0) {
      setError("Conversion rate must be a positive number.");
      return;
    }

    setPnl((pnlInQuote * rate).toFixed(2));
  };

  return (
    <ToolPage
      title="PnL Calculator"
      help={help}
      editMode={editMode}
      onEditModeChange={setEditMode}
      result={
        pnl !== null && (
          <Card className="w-full lg:w-1/3">
            <CardContent>
              <CardTitle>{`PNL: ${pnl} ${depositCurrency}`}</CardTitle>
            </CardContent>
          </Card>
        )
      }
    >
      {editMode ? (
        <TextField
          label="Symbol"
          value={currencyPair}
          onChange={setCurrencyPair}
        />
      ) : (
        <SelectField
          label="Symbol"
          value={currencyPair}
          onChange={setCurrencyPair}
          options={CURRENCY_PAIRS}
          placeholder="Select symbol"
        />
      )}
      <NumberField
        label="Contract Size"
        placeholder="set contract size..."
        value={contractSize}
        onChange={setContractSize}
      />
      <SelectField
        label="Order type"
        value={tradeType}
        onChange={setTradeType}
        options={TRADE_TYPES}
      />
      <NumberField
        label="Open Price"
        placeholder="set open price"
        value={openPrice}
        onChange={setOpenPrice}
      />
      <NumberField
        label="Close Price"
        placeholder="set close price"
        value={closePrice}
        onChange={setClosePrice}
      />
      <NumberField
        label="Lots"
        placeholder="set lots..."
        value={tradeSize}
        onChange={setTradeSize}
      />
      <SelectField
        label="Account Currency"
        value={depositCurrency}
        onChange={setDepositCurrency}
        options={CURRENCIES}
        placeholder="Select deposit currency"
      />
      {editMode && (
        <NumberField
          label={`Conversion rate (${quote} → ${depositCurrency})`}
          placeholder="leave empty to fetch the live rate"
          value={conversionRate}
          onChange={setConversionRate}
        />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={calculatePnl}>Calculate</Button>
    </ToolPage>
  );
};

export default PnlCalculator;
