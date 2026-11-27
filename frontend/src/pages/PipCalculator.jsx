import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { allCurrencyPairs, uniqueCurrencies, pipHowTo } from "../utils/helpers";
import { fetchExchangeRate, fetchConversionRate } from "../utils/fetchData";
import { calculatePipValue } from "../utils/calculations";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CalculatorPage,
  FormCard,
  FormField,
  FormSection,
  HelpDialog,
  NumberInput,
  RateModeToggle,
  ResultCard,
  ResultDetails,
  ResultValue,
  SelectInput,
} from "../components/CalculatorUI";

const PipCalculator = () => {
  const [currencyPair, setCurrnecyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("EUR");
  const [base, setBase] = useState("EUR");
  const [quote, setQuote] = useState("USD");
  const [positionSize, setPositionSize] = useState(100000);
  const [pipSize, setPipSize] = useState(0.0001);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [prevExchangeRate, setPrevExchangeRate] = useState(1);
  const [pipValue, setPipValue] = useState(null);
  const [showConversion, setShowConversion] = useState(false);
  const [conversionRate, setConversionRate] = useState(1);
  const [isJPY, setIsJPY] = useState(false);
  const [checkboxDisabled, setCheckboxDisabled] = useState(true);
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [conversionPair, setConversionPair] = useState("");
  const [prevDepositCurrency, setPrevDepositCurrency] = useState("EUR");
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleFetchData = async () => {
      if (!editMode) {
        if (quote === depositCurrency) return;
        if (showConversion) {
          let pair = `${depositCurrency}/${quote}`;
          if (depositCurrency === "JPY") {
            pair = `${quote}/${depositCurrency}`;
          }
          setConversionPair(pair);
          const rate = await fetchConversionRate(pair);
          if (rate !== null) {
            setExchangeRate(1);
            setConversionRate(parseFloat(rate.toFixed(5)));
          }
        } else {
          setExchangeRate(parseFloat(prevExchangeRate));
          const rate = await fetchExchangeRate(
            currencyPair,
            prevExchangeRate,
          );
          if (rate !== null) {
            setExchangeRate(parseFloat(rate.toFixed(5)));
            setPrevExchangeRate(parseFloat(rate.toFixed(5)));
          }
        }
      }
    };

    handleFetchData();
  }, [
    showConversion,
    prevExchangeRate,
    base,
    depositCurrency,
    quote,
    editMode,
  ]);

  useEffect(() => {
    if (depositCurrency === quote) {
      setExchangeRate(1);
      setCheckBoxChecked(false);
      setCheckboxDisabled(true);
    } else if (depositCurrency === base) {
      setCheckBoxChecked(false);
      setCheckboxDisabled(true);
    } else {
      setExchangeRate(prevExchangeRate);
      setCheckBoxChecked(true);
      setCheckboxDisabled(false);
    }
  }, [depositCurrency, quote, prevExchangeRate, editMode]);

  const handleCurrencySelect = (value) => {
    setCurrnecyPair(value);

    const [baseCurrency, quoteCurrency] = value.split("/");

    setBase(baseCurrency);
    setQuote(quoteCurrency);
    setDepositCurrency(baseCurrency);
    setPrevDepositCurrency(baseCurrency);
    setPipValue(null);

    if (quoteCurrency.includes("JPY")) {
      setPipSize(0.01);
    } else {
      setPipSize(0.0001);
    }

    if (baseCurrency === baseCurrency || baseCurrency === quoteCurrency) {
      setShowConversion(false);
      setCheckBoxChecked(false);
      setCheckboxDisabled(false);
    } else {
      setShowConversion(true);
      setCheckBoxChecked(true);
      setCheckboxDisabled(true);
    }
  };

  const handleDepositCurrency = (value) => {
    const newDepositCurrency = value;

    setDepositCurrency(newDepositCurrency);
    setIsJPY(newDepositCurrency === "JPY");
    setPipValue(null);
    if (
      base === newDepositCurrency ||
      quote === newDepositCurrency ||
      newDepositCurrency === base ||
      depositCurrency === quote
    ) {
      setShowConversion(false);
      setCheckBoxChecked(false);
      setCheckboxDisabled(true);
    } else {
      setShowConversion(true);
      setCheckBoxChecked(true);
      setCheckboxDisabled(false);
    }
  };

  const handleClick = () => {
    const res = calculatePipValue(
      pipSize,
      positionSize,
      exchangeRate,
      conversionRate,
      showConversion,
      isJPY,
    );
    setPipValue(res);
  };

  const handleCheckbox = (value) => {
    setShowConversion(value);
    setCheckBoxChecked(!checkBoxChecked);

    setDepositCurrency(prevDepositCurrency);
  };

  const handleExchangeRateInput = (e) => {
    const newRate = e.target.value ? parseFloat(e.target.value) : "";
    setExchangeRate(newRate);
  };

  const handlePositionSizeInput = (e) => {
    setPositionSize(e.target.value ? parseFloat(e.target.value) : "");
  };
  const handlePipSizeInput = (e) => {
    setPipSize(e.target.value ? parseFloat(e.target.value) : "");
  };
  const handleConverisonInput = (e) => {
    setConversionRate(parseFloat(e.target.value));
  };

  const handleToggleModal = () => {
    setShowModal(true);
  };

  return (
    <CalculatorPage
      icon={TrendingUp}
      title="Pip value"
      description="How much one pip is worth in your account currency."
      onHelp={handleToggleModal}
      action={<RateModeToggle manual={editMode} onChange={setEditMode} />}
    >
      {showModal && (
        <HelpDialog
          title="Pip value"
          content={pipHowTo.content}
          onClose={() => setShowModal(false)}
        />
      )}

      <FormCard onSubmit={handleClick}>
        <FormSection title="Instrument">
          <FormField label="Symbol">
            {(id) => (
              <SelectInput
                id={id}
                value={currencyPair}
                onChange={handleCurrencySelect}
                options={allCurrencyPairs}
                placeholder="Select symbol"
              />
            )}
          </FormField>
          <FormField
            label="Exchange rate"
            hint={editMode ? "Enter the rate yourself." : "Fetched live."}
          >
            {(id) => (
              <NumberInput
                id={id}
                value={exchangeRate}
                onChange={handleExchangeRateInput}
                disabled={!editMode}
              />
            )}
          </FormField>
          <FormField label="Position size">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 100000"
                value={positionSize}
                onChange={handlePositionSizeInput}
                disabled={showConversion}
                unit="units"
              />
            )}
          </FormField>
          <FormField label="Pip size">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 0.0001"
                value={pipSize}
                onChange={handlePipSizeInput}
                disabled={showConversion}
              />
            )}
          </FormField>
        </FormSection>

        <FormSection title="Account">
          <FormField label="Account currency">
            {(id) => (
              <SelectInput
                id={id}
                value={depositCurrency}
                onChange={handleDepositCurrency}
                options={uniqueCurrencies}
                placeholder="Select currency"
              />
            )}
          </FormField>
          <div className="flex items-center gap-2 sm:pt-7">
            <Checkbox
              id="conversion-change"
              checked={checkBoxChecked}
              disabled={checkboxDisabled}
              onCheckedChange={handleCheckbox}
            />
            <Label htmlFor="conversion-change" className="font-normal">
              Show conversion rate
            </Label>
          </div>
          {showConversion && (
            <FormField
              label={`Conversion rate${conversionPair ? ` (${conversionPair})` : ""}`}
              className="sm:col-span-2"
            >
              {(id) => (
                <NumberInput
                  id={id}
                  placeholder="e.g. 1.10018"
                  value={conversionRate}
                  onChange={handleConverisonInput}
                  disabled={!editMode}
                />
              )}
            </FormField>
          )}
        </FormSection>
      </FormCard>

      <ResultCard
        empty={
          <>
            <TrendingUp className="size-6" />
            Fill in the form and press Calculate.
          </>
        }
      >
        {pipValue && (
          <>
            <ResultValue
              label="Value of 1 pip"
              value={pipValue}
              unit={depositCurrency}
            />
            <ResultDetails
              rows={[
                ["Symbol", currencyPair],
                ["Position size", positionSize],
                ["Pip size", pipSize],
                ["Exchange rate", exchangeRate],
                ...(showConversion
                  ? [[`Conversion (${conversionPair})`, conversionRate]]
                  : []),
              ]}
            />
          </>
        )}
      </ResultCard>
    </CalculatorPage>
  );
};

export default PipCalculator;
