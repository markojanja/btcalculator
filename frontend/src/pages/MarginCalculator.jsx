import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import help from "../content/help/margin.md?raw";
import {
  CALCULATION_TYPES,
  CURRENCIES,
  CURRENCY_PAIRS,
  TRADE_TYPES,
} from "../constants/currencies";
import { fetchConversionRate } from "../api/rates";
import {
  marginCalculationCFD,
  marginCalculationForex,
  parseNumber,
  splitPair,
} from "../utils/calculations";
import {
  CheckboxField,
  NumberField,
  SelectField,
} from "../components/form/fields";
import ToolPage from "../components/ToolPage";

// Saved calculations with a total per account currency.
const MarginTable = ({ calculations, onDelete }) => {
  const totals = calculations.reduce((acc, item) => {
    acc[item.deposit] = (acc[item.deposit] ?? 0) + item.marginRequired;
    return acc;
  }, {});

  return (
    <Table className="lg:max-w-[50%] mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Lot Size</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Margin (%)</TableHead>
          <TableHead>Leverage</TableHead>
          <TableHead className="text-right">Margin Required</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calculations.map((calc) => (
          <TableRow key={calc.id}>
            <TableCell>{calc.pair}</TableCell>
            <TableCell>{calc.tradeType}</TableCell>
            <TableCell>{calc.lotSize}</TableCell>
            <TableCell>{calc.price}</TableCell>
            <TableCell>{calc.margin}</TableCell>
            <TableCell>{calc.leverage}</TableCell>
            <TableCell className="text-right font-medium">
              {`${calc.marginRequired.toFixed(2)} ${calc.deposit}`}
            </TableCell>
            <TableCell className="text-center">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove calculation"
                onClick={() => onDelete(calc.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="w-full">
        <TableRow>
          <TableCell colSpan={8} className="text-right text-base font-medium">
            Total margin:{" "}
            {Object.entries(totals).map(([currency, total]) => (
              <span key={currency} className="ml-2">
                <span className="text-xl font-bold text-primary">
                  {total.toFixed(2)}
                </span>{" "}
                {currency}
              </span>
            ))}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

const MarginCalculator = () => {
  const [activeType, setActiveType] = useState("forex");
  const [calculations, setCalculations] = useState([]);
  const [contractSize, setContractSize] = useState(100000);
  const [lotSize, setLotSize] = useState(1);
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState(100);
  const [margin, setMargin] = useState("");
  const [pair, setPair] = useState("EUR/USD");
  const [tradeType, setTradeType] = useState("BUY");
  const [manualConversion, setManualConversion] = useState(false);
  const [conversion, setConversion] = useState("");
  const [deposit, setDeposit] = useState("EUR");
  const [error, setError] = useState("");

  const { base, quote } = splitPair(pair);
  // Cross currency: the account currency is neither side of the pair, so the
  // margin (held in the base currency) needs a base -> deposit rate.
  const needsConversion = deposit !== base && deposit !== quote;

  useEffect(() => {
    if (!needsConversion) return;

    let cancelled = false;
    setConversion("");
    fetchConversionRate(base, deposit)
      .then((rate) => {
        if (!cancelled) setConversion(parseFloat(rate.toFixed(5)));
      })
      .catch(() => {
        if (!cancelled) {
          setManualConversion(true);
          setError(`Could not fetch ${base}/${deposit}. Enter it manually.`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [base, deposit, needsConversion]);

  const handleCalculate = () => {
    setError("");

    const contract = parseNumber(contractSize);
    const lots = parseNumber(lotSize);
    const currency = {
      pair,
      deposit,
      price: parseNumber(price),
      conversion: parseNumber(conversion),
    };

    const res =
      activeType === "forex"
        ? marginCalculationForex({
            contractSize: contract,
            lotSize: lots,
            leverage: parseNumber(leverage),
            ...currency,
          })
        : marginCalculationCFD({
            contractSize: contract,
            lotSize: lots,
            marginPercent: parseNumber(margin),
            ...currency,
          });

    if (!Number.isFinite(res) || res <= 0) {
      const missing = [
        "contract size",
        "lot size",
        activeType === "forex" ? "leverage" : "margin %",
      ];
      if (deposit === quote) missing.push("price");
      if (needsConversion) missing.push(`${base} → ${deposit} conversion rate`);
      setError(`Check these fields: ${missing.join(", ")}.`);
      return;
    }

    setCalculations((prev) => [
      ...prev,
      {
        id: Date.now(),
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin: activeType === "cfd" ? margin : "-",
        leverage: activeType === "forex" ? leverage : "-",
        deposit,
        marginRequired: res,
      },
    ]);
  };

  const handleDelete = (id) => {
    setCalculations((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ToolPage
      title="Margin Calculator"
      help={help}
      result={
        calculations.length > 0 && (
          <MarginTable calculations={calculations} onDelete={handleDelete} />
        )
      }
    >
      <Field>
        <Label>Type Of Calculation</Label>
        <ToggleGroup
          type="single"
          value={activeType}
          onValueChange={(value) => value && setActiveType(value)}
          className="justify-start border-secondary"
        >
          {CALCULATION_TYPES.map((item) => (
            <ToggleGroupItem
              className="data-[state=on]:bg-primary data-[state=on]:text-white transition-all duration-150"
              key={item}
              value={item}
            >
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>
      <FieldGroup className="flex flex-row">
        <SelectField
          label="Symbol"
          value={pair}
          onChange={setPair}
          options={CURRENCY_PAIRS}
          placeholder="Select symbol"
        />
        <SelectField
          label="Order Type"
          value={tradeType}
          onChange={setTradeType}
          options={TRADE_TYPES}
        />
      </FieldGroup>
      <FieldGroup className="flex flex-row">
        <NumberField
          label="Contract Size"
          placeholder="set contract size..."
          value={contractSize}
          onChange={setContractSize}
        />
        <NumberField
          label="Lot Size"
          placeholder="set lot size..."
          value={lotSize}
          onChange={setLotSize}
        />
      </FieldGroup>
      <FieldGroup className="flex flex-row">
        <NumberField
          label="Price"
          placeholder="set instrument price..."
          value={price}
          onChange={setPrice}
        />
        {activeType === "forex" ? (
          <NumberField
            label="Leverage"
            placeholder="set leverage..."
            value={leverage}
            onChange={setLeverage}
          />
        ) : (
          <NumberField
            label="Margin (%)"
            placeholder="set margin percentage..."
            value={margin}
            onChange={setMargin}
          />
        )}
      </FieldGroup>
      <SelectField
        label="Select Account Currency"
        value={deposit}
        onChange={setDeposit}
        options={CURRENCIES}
      />
      <CheckboxField
        label="enter conversion rate manually"
        checked={manualConversion}
        disabled={!needsConversion}
        onChange={setManualConversion}
      />
      {needsConversion && (
        <NumberField
          label={`Conversion rate (${base} → ${deposit})`}
          placeholder={`price of ${base}/${deposit}`}
          value={conversion}
          onChange={setConversion}
          disabled={!manualConversion}
        />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleCalculate}>Calculate</Button>
    </ToolPage>
  );
};

export default MarginCalculator;
