import { useState } from "react";
import { Percent, Trash2 } from "lucide-react";
import {
  marginCalculationCFD,
  marginCalculationForex,
} from "../utils/calculations";
import {
  allCurrencyPairs,
  uniqueCurrencies,
  calcType,
  tradeTypeList,
  marginHowTo,
} from "../utils/helpers";
import { fetchExchangeRate } from "../utils/fetchData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalculatorPage,
  FormCard,
  FormField,
  FormSection,
  HelpDialog,
  NumberInput,
  ResultCard,
  SegmentedControl,
  SelectInput,
} from "../components/CalculatorUI";

const MarginCalculator = () => {
  const [activeType, setActveType] = useState("forex");
  const [calculations, setCalculations] = useState([]);
  const [contractSize, setContractSize] = useState(100000);
  const [lotSize, setLotSize] = useState(1);
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState(100);
  const [margin, setMargin] = useState("");
  const [pair, setPair] = useState("EUR/USD");
  const [tradeType, setTradeType] = useState("BUY");
  const [showConversion, setShowConversion] = useState(false);
  const [conversion, setConversion] = useState("");
  const [deposit, setDeposit] = useState("EUR");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };
  const handleTypeSelect = (value) => {
    if (!value) return;
    setActveType(value);
  };
  const handleSelect = (setter) => (value) => {
    setter(value);
  };
  const handleCalculate = () => {
    let res;
    let newPair;
    //test
    if (activeType === "forex") {
      setMargin("-");
      res = marginCalculationForex(
        contractSize,
        lotSize,
        price,
        leverage,
        pair,
        deposit,
        conversion,
      );
      newPair = {
        id: Date.now(),
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin: "-",
        leverage,
        marginRequired: parseFloat(res),
      };
    } else if (activeType === "cfd") {
      setLeverage("-");

      res = marginCalculationCFD(
        contractSize,
        lotSize,
        price,
        margin,
        pair,
        deposit,
        conversion,
      );
      newPair = {
        id: Date.now(),
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin,
        leverage: "-",
        marginRequired: parseFloat(res) * conversion,
      };
    } else {
      return;
    }

    setCalculations([...calculations, newPair]);
  };

  const handleCheckbox = () => {
    setShowConversion(!showConversion);
  };

  const handleDelete = (id) => {
    const newCalc = calculations.filter((item) => item.id !== id);
    setCalculations(newCalc);
  };

  const handleDepositSelect = async (value) => {
    const [base] = pair.split("/");
    const conversionPair = `${base}/${value}`;

    try {
      const conversionPrice = await fetchExchangeRate(conversionPair, conversion);
      setConversion(conversionPrice);
    } catch (err) {
      console.error("Conversion fetch failed", err);
    }

    setDeposit(value);
  };

  const totalPrice = calculations
    .map((item) => item.marginRequired)
    .reduce((sum, margin) => sum + margin, 0);

  const handleToggleModal = () => {
    setShowModal(true);
  };

  return (
    <CalculatorPage
      icon={Percent}
      title="Margin"
      description="Margin required to open positions. Add several to see the total."
      onHelp={handleToggleModal}
    >
      {showModal && (
        <HelpDialog
          title="Margin"
          content={marginHowTo.content}
          onClose={() => setShowModal(false)}
        />
      )}

      <FormCard onSubmit={handleCalculate} submitLabel="Add calculation">
        <FormSection title="Instrument">
          <FormField label="Instrument type" className="sm:col-span-2">
            <SegmentedControl
              value={activeType}
              onChange={handleTypeSelect}
              options={calcType}
              format={(t) => t.toUpperCase()}
            />
          </FormField>
          <FormField label="Symbol">
            {(id) => (
              <SelectInput
                id={id}
                value={pair}
                onChange={handleSelect(setPair)}
                options={allCurrencyPairs}
                placeholder="Select symbol"
              />
            )}
          </FormField>
          <FormField label="Direction">
            <SegmentedControl
              value={tradeType}
              onChange={setTradeType}
              options={tradeTypeList}
            />
          </FormField>
        </FormSection>

        <FormSection title="Position">
          <FormField label="Contract size">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 100000"
                value={contractSize}
                onChange={handleChange(setContractSize)}
              />
            )}
          </FormField>
          <FormField label="Volume">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 1"
                value={lotSize}
                onChange={handleChange(setLotSize)}
                unit="lots"
              />
            )}
          </FormField>
          <FormField label="Price">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="Current price"
                value={price}
                onChange={handleChange(setPrice)}
              />
            )}
          </FormField>
          {activeType === "forex" ? (
            <FormField label="Leverage">
              {(id) => (
                <NumberInput
                  id={id}
                  placeholder="e.g. 100"
                  value={leverage}
                  onChange={handleChange(setLeverage)}
                  unit=": 1"
                />
              )}
            </FormField>
          ) : (
            <FormField label="Margin">
              {(id) => (
                <NumberInput
                  id={id}
                  placeholder="e.g. 5"
                  value={margin}
                  onChange={handleChange(setMargin)}
                  unit="%"
                />
              )}
            </FormField>
          )}
        </FormSection>

        <FormSection title="Account">
          <FormField label="Account currency">
            {(id) => (
              <SelectInput
                id={id}
                value={deposit}
                onChange={handleDepositSelect}
                options={uniqueCurrencies}
                placeholder="Select currency"
              />
            )}
          </FormField>
          <div className="flex items-center gap-2 sm:pt-7">
            <Checkbox
              id="conversion-change"
              checked={showConversion}
              onCheckedChange={handleCheckbox}
            />
            <Label htmlFor="conversion-change" className="font-normal">
              Show conversion rate
            </Label>
          </div>
          {showConversion && (
            <FormField
              label="Conversion rate"
              hint="Base currency to account currency, e.g. EUR/AUD."
              className="sm:col-span-2"
            >
              {(id) => (
                <Input
                  id={id}
                  className="h-10"
                  placeholder="e.g. 1.65"
                  value={conversion}
                  onChange={handleChange(setConversion)}
                />
              )}
            </FormField>
          )}
        </FormSection>
      </FormCard>

      <ResultCard
        title="Calculations"
        empty={
          <>
            <Percent className="size-6" />
            Added calculations appear here.
          </>
        }
      >
        {calculations.length > 0 && (
          <div className="space-y-4">
            <ul className="divide-y">
              {calculations.map((calc) => (
                <li key={calc.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {calc.pair}{" "}
                      <span
                        className={
                          calc.tradeType === "BUY"
                            ? "text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-xs font-semibold text-red-600 dark:text-red-400"
                        }
                      >
                        {calc.tradeType}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {calc.lotSize} lots @ {calc.price} ·{" "}
                      {calc.leverage !== "-"
                        ? `1:${calc.leverage}`
                        : `${calc.margin}% margin`}
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums">
                    {Number(calc.marginRequired).toFixed(2)}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(calc.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${calc.pair}`}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between rounded-xl bg-primary/10 p-4">
              <span className="text-sm text-muted-foreground">
                Total margin
              </span>
              <span className="text-2xl font-bold tabular-nums text-primary">
                {Number(totalPrice).toFixed(2)}{" "}
                <span className="text-base font-semibold text-muted-foreground">
                  {deposit}
                </span>
              </span>
            </div>
          </div>
        )}
      </ResultCard>
    </CalculatorPage>
  );
};

export default MarginCalculator;
