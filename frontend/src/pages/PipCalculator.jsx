import { useState, useEffect } from "react";
import { CardContent, CardTitle, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import help from "../content/help/pip.md?raw";
import { CURRENCIES, CURRENCY_PAIRS } from "../constants/currencies";
import { fetchConversionRate } from "../api/rates";
import { formatPipValue } from "../lib/format";
import {
  calculatePipValue,
  getPipSize,
  parseNumber,
  splitPair,
} from "../utils/calculations";
import { NumberField, SelectField } from "../components/form/fields";
import ToolPage from "../components/ToolPage";

const PipCalculator = () => {
  const [currencyPair, setCurrencyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("EUR");
  const [positionSize, setPositionSize] = useState(100000);
  const [pipSize, setPipSize] = useState(0.0001);
  const [conversionRate, setConversionRate] = useState(1);
  const [pipValue, setPipValue] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const { quote } = splitPair(currencyPair);
  const needsConversion = quote !== depositCurrency;

  // Rate that converts the quote currency into the account currency.
  useEffect(() => {
    if (!needsConversion) {
      setConversionRate(1);
      return;
    }
    if (editMode) return;

    let cancelled = false;
    setError("");
    fetchConversionRate(quote, depositCurrency)
      .then((rate) => {
        if (!cancelled) setConversionRate(parseFloat(rate.toFixed(5)));
      })
      .catch(() => {
        if (!cancelled)
          setError(
            `Could not fetch ${quote}/${depositCurrency}. Enter it manually in edit mode.`,
          );
      });

    return () => {
      cancelled = true;
    };
  }, [quote, depositCurrency, needsConversion, editMode]);

  const handleCurrencySelect = (value) => {
    setCurrencyPair(value);
    setDepositCurrency(splitPair(value).base);
    setPipSize(getPipSize(value));
    setPipValue(null);
  };

  const handleDepositCurrency = (value) => {
    setDepositCurrency(value);
    setPipValue(null);
  };

  const handleCalculate = () => {
    const values = [pipSize, positionSize, conversionRate].map(parseNumber);
    if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
      setError("Position size, pip size and conversion rate must be positive.");
      setPipValue(null);
      return;
    }

    setError("");
    setPipValue(formatPipValue(calculatePipValue(...values)));
  };

  return (
    <ToolPage
      title="Pip Value Calculator"
      help={help}
      editMode={editMode}
      onEditModeChange={setEditMode}
      showEditModeInfo
      result={
        pipValue !== null && (
          <Card className="w-full lg:w-1/3">
            <CardContent>
              <CardTitle>{`Pip value: ${pipValue} ${depositCurrency}`}</CardTitle>
            </CardContent>
          </Card>
        )
      }
    >
      <SelectField
        label="Symbol"
        value={currencyPair}
        onChange={handleCurrencySelect}
        options={CURRENCY_PAIRS}
      />
      <NumberField
        label="Position Size"
        placeholder="e.g 100,000"
        value={positionSize}
        onChange={setPositionSize}
      />
      <NumberField
        label="Pip Size"
        placeholder="e.g 0.0001"
        value={pipSize}
        onChange={setPipSize}
      />
      <SelectField
        label="Account Currency"
        value={depositCurrency}
        onChange={handleDepositCurrency}
        options={CURRENCIES}
      />
      {needsConversion && (
        <NumberField
          label={`Conversion Rate (${quote} → ${depositCurrency})`}
          placeholder="e.g 0.90894"
          value={conversionRate}
          onChange={setConversionRate}
          disabled={!editMode}
        />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleCalculate}>Calculate</Button>
    </ToolPage>
  );
};

export default PipCalculator;
