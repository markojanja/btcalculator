/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import "./PipCalculator.css";
import { useState, useEffect } from "react";
import { allCurrencyPairs, uniqueCurrencies } from "../utils/helpers";

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

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.twelvedata.com/exchange_rate?symbol=${currencyPair}&apikey=${API_KEY}`
        );
        if (res.data.rate) {
          setExchangeRate(parseFloat(res.data.rate));
          setPrevExchangeRate(parseFloat(res.data.rate));
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    const fetchDataForConversion = async () => {
      let pair = `${quote}/${depositCurrency}`;
      setConversionPair(pair);
      if (!allCurrencyPairs.includes(pair)) {
        pair = `${depositCurrency}/${quote}`;
        setConversionPair(pair);
      }
      const res = await axios.get(
        `https://api.twelvedata.com/exchange_rate?symbol=${pair}&apikey=${API_KEY}`
      );
      if (res.data.rate) {
        setExchangeRate(1);
        setConversionRate(res.data.rate);
      }
    };

    if (quote === depositCurrency) return;

    if (showConversion) {
      fetchDataForConversion();
    } else {
      setExchangeRate(prevExchangeRate);
      fetchData();
    }
  }, [showConversion, prevExchangeRate, base, depositCurrency, quote]);

  useEffect(() => {
    if (depositCurrency === quote) {
      setExchangeRate(1);
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
  const calculatePipValue = () => {
    const res = (pipSize * positionSize) / exchangeRate;
    return res % 1 === 0 ? res : parseFloat(res.toFixed(6));
  };

  const pipValueWithConversion = () => {
    const calculatedPipvalue = calculatePipValue();
    if (showConversion && isJPY) {
      return parseFloat((calculatedPipvalue * conversionRate).toFixed(6));
    } else {
      return parseFloat((calculatedPipvalue / conversionRate).toFixed(6));
    }
  };

  const handleClick = () => {
    showConversion ? setPipValue(pipValueWithConversion()) : setPipValue(calculatePipValue());
  };

  const handleCheckbox = (e) => {
    setShowConversion(e.target.checked);
    setCheckBoxChecked(!checkBoxChecked);

    setDepositCurrency(prevDepositCurrency);
  };

  return (
    <>
      <div className="calculator">
        <h2>Pip value calculator</h2>

        <div className="input-group flex-col">
          <label htmlFor="curr_pair">currency pair</label>
          <select id="curr_pair" value={currencyPair} onChange={handleCurrencySelect}>
            {allCurrencyPairs.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group flex-col">
          <label htmlFor="price">exchange rate</label>
          <input
            type="number"
            value={exchangeRate || ""}
            placeholder="e.g 1.1234"
            onChange={(e) => {
              setExchangeRate(parseFloat(e.target.value)), setPrevExchangeRate(e.target.value);
            }}
            name="price"
            id="price"
            disabled={showConversion}
          />
        </div>
        <div className="input-group flex-col">
          <label htmlFor="position_size">position size</label>
          <input
            type="number"
            value={positionSize}
            placeholder="e.g 100,000"
            onChange={(e) => setPositionSize(parseInt(e.target.value))}
            name="position_size"
            id="position_size"
          />
        </div>
        <div className="input-group flex-col">
          <label htmlFor="account_currency">pip size</label>
          <input
            type="number"
            value={pipSize}
            placeholder="e.g 0.0001"
            onChange={(e) => setPipSize(parseFloat(e.target.value))}
            name="account_currency"
            id="account_currency"
          />
        </div>
        <div className="input-group flex-col">
          <label htmlFor="currencyType">Deposit currency</label>
          <select id="currencyType" onChange={handleDepositCurrency} value={depositCurrency}>
            {uniqueCurrencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
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
          <div className="input-group flex-col">
            <label htmlFor="cprice">conversion rate {conversionPair}</label>
            <input
              type="number"
              placeholder="e.g 1.1234"
              onChange={(e) => setConversionRate(parseFloat(e.target.value))}
              name="cprice"
              id="cprice"
              value={conversionRate || ""}
            />
          </div>
        )}

        <button className="btn" onClick={handleClick}>
          Calculate
        </button>
      </div>

      {pipValue && (
        <div className="results-display">
          <h2>
            Pip value: {pipValue} {depositCurrency}
          </h2>
        </div>
      )}
    </>
  );
};

export default PipCalculator;
