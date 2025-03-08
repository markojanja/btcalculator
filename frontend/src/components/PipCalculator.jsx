import "./PipCalculator.css";
import { useState, useEffect } from "react";
import { allCurrencyPairs, uniqueCurrencies } from "../utils/helpers";
import Input from "./Input";
import ResultsDisplay from "./ResultsDisplay";
import Select from "./Select";
import { fetchExchangeRate, fetchConversionRate } from "../utils/fetchData";
import CalculatorHeading from "./CalculatorHeading";
import Info from "./Info";
import { calculatePipValue } from "../utils/calculations";
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

  const API_KEY = import.meta.env.VITE_API_KEY;

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
          const rate = await fetchConversionRate(pair, API_KEY);
          if (rate !== null) {
            setExchangeRate(1);
            setConversionRate(parseFloat(rate.toFixed(5)));
          }
        } else {
          setExchangeRate(parseFloat(prevExchangeRate));
          const rate = await fetchExchangeRate(currencyPair, API_KEY, prevExchangeRate);
          if (rate !== null) {
            setExchangeRate(parseFloat(rate.toFixed(5)));
            setPrevExchangeRate(parseFloat(rate.toFixed(5)));
          }
        }
      }
    };

    handleFetchData();
  }, [showConversion, prevExchangeRate, base, depositCurrency, quote, editMode]);

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
  }, [depositCurrency, quote, prevExchangeRate]);

  const handleCurrencySelect = (e) => {
    setCurrnecyPair(e.target.value);
    const [baseCurrency, quoteCurrency] = e.target.value.split("/");
    setBase(baseCurrency);
    setQuote(quoteCurrency);
    setDepositCurrency(baseCurrency);
    setPrevDepositCurrency(baseCurrency);
    setPipValue(null);

    if (quoteCurrency.includes("JPY")) {
      setPipSize(0.01);
      setCheckBoxChecked(true);
    } else {
      setPipSize(0.0001);
      setCheckBoxChecked(false);
    }

    if (depositCurrency === base || depositCurrency === quote) {
      setShowConversion(false);
      setCheckBoxChecked(false);
      setCheckboxDisabled(false);
    } else {
      setShowConversion(true);
      setCheckBoxChecked(true);
      setCheckboxDisabled(true);
    }
  };

  const handleDepositCurrency = (e) => {
    const newDepositCurrency = e.target.value;

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
      isJPY
    );
    setPipValue(res);
  };

  const handleCheckbox = (e) => {
    setShowConversion(e.target.checked);
    setCheckBoxChecked(!checkBoxChecked);

    setDepositCurrency(prevDepositCurrency);
  };

  const handleExchangeRateInput = (e) => {
    setExchangeRate(e.target.value ? parseFloat(e.target.value) : "");
    setPrevExchangeRate(e.target.value);
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

  return (
    <>
      <Info editMode={editMode} />
      <div className={`calculator ${editMode ? "active-border" : ""}`}>
        <CalculatorHeading
          title={"Pip Value Calculator"}
          editMode={editMode}
          setEditMode={setEditMode}
          visible={true}
        />
        <Select
          label={"currency pair"}
          value={currencyPair}
          onChange={handleCurrencySelect}
          array={allCurrencyPairs}
        />
        <Input
          label={"exchange rate"}
          placeholder={"e.g. 1.1008"}
          value={exchangeRate}
          onChange={handleExchangeRateInput}
          disabled={!editMode}
        />
        <Input
          label={"position size"}
          placeholder={"e.g 100,000"}
          value={positionSize}
          onChange={handlePositionSizeInput}
          disabled={showConversion}
        />
        <Input
          label={"pip size"}
          placeholder={"e.g 0.0001"}
          value={pipSize}
          onChange={handlePipSizeInput}
          disabled={showConversion}
        />
        <Select
          label={"account currency"}
          value={depositCurrency}
          onChange={handleDepositCurrency}
          array={uniqueCurrencies}
        />
        <div className="input-group flex-col">
          <label htmlFor="checkbox">show conversion rate</label>
          <input
            id="checkbox"
            type="checkbox"
            checked={checkBoxChecked}
            disabled={checkboxDisabled}
            onChange={handleCheckbox}
            className="w-auto"
          />
        </div>
        {showConversion && (
          <Input
            label={`conversion rate ${conversionPair}`}
            placeholder={"e.g 1.10018"}
            value={conversionRate}
            onChange={handleConverisonInput}
            disabled={!editMode}
          />
        )}
        <button className="btn" onClick={handleClick}>
          Calculate
        </button>
      </div>

      {pipValue && (
        <ResultsDisplay text={"Pip value"} value={pipValue} depositCurrency={depositCurrency} />
      )}
    </>
  );
};

export default PipCalculator;
