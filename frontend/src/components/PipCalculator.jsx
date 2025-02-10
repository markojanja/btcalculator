/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import "./PipCalculator.css";
import { useState, useEffect } from "react";
import { allCurrencyPairs, uniqueCurrencies } from "../utils/helpers";

const PipCalculator = () => {
  const [currencyPair, setCurrnecyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("EUR");
  const [base, setBase] = useState(null);
  const [quote, setQuote] = useState(null);
  const [positionSize, setPositionSize] = useState(100000);
  const [pipSize, setPipSize] = useState(0.0001);
  const [exchangeRate, setExchangeRate] = useState();
  const [prevExchangerate, setPrevExRate] = useState();
  const [pipValue, setPipValue] = useState(null);
  const [showConversion, setShowConversion] = useState(false);
  const [conversionRate, setConversionRate] = useState(null);
  const [isJPY, setIsJPY] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const [baseCurrency, quoteCurrency] = currencyPair.split("/");
    setBase(baseCurrency);
    setQuote(quoteCurrency);
  }, [base, quote]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `https://api.twelvedata.com/exchange_rate?symbol=${quote}/${depositCurrency}&apikey=${API_KEY}`
      );
      if (res.data.rate) {
        setExchangeRate(1);
        setConversionRate(res.data.rate);
      }
    };
    if (showConversion) {
      fetchData();
    } else {
      setExchangeRate(prevExchangerate);
    }
  }, [showConversion, prevExchangerate, conversionRate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.twelvedata.com/exchange_rate?symbol=${currencyPair}&apikey=${API_KEY}`
        );
        if (res.data.rate) {
          setExchangeRate(parseFloat(res.data.rate));
          setPrevExRate(parseFloat(res.data.rate));
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchData();
  }, [currencyPair]);

  useEffect(() => {
    if (depositCurrency === quote) {
      setExchangeRate(1);
    } else {
      setExchangeRate(prevExchangerate);
    }
  }, [depositCurrency, quote, prevExchangerate]);

  const handleCurrencySelect = (e) => {
    setCurrnecyPair(e.target.value);
    const [baseCurrency, quoteCurrency] = e.target.value.split("/");
    setBase(baseCurrency);
    setQuote(quoteCurrency);
  };
  const handleDepostiCurrency = (e) => {
    setDepositCurrency(e.target.value);
    setIsJPY(e.target.value === "JPY");
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

  return (
    <>
      <div className="calculator">
        <h2>Pip value calculator</h2>
        <div className="input-group flex-col">
          <label htmlFor="currencyType">Deposit currency</label>
          <select defaultValue={depositCurrency} id="currencyType" onChange={handleDepostiCurrency}>
            {uniqueCurrencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group flex-col">
          <label htmlFor="curr_pair">currency pair</label>
          <select id="curr_pair" onChange={handleCurrencySelect}>
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
            defaultValue={exchangeRate}
            placeholder="e.g 1.1234"
            onChange={(e) => {
              setExchangeRate(parseFloat(e.target.value)), setPrevExRate(e.target.value);
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
            defaultValue={positionSize}
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
            defaultValue={pipSize}
            placeholder="e.g 0.0001"
            onChange={(e) => setPipSize(parseFloat(e.target.value))}
            name="account_currency"
            id="account_currency"
          />
        </div>
        <div className="input-group flex-col">
          <label htmlFor="checkbox">show conversion rate</label>
          <input
            id="checkbox"
            type="checkbox"
            checked={showConversion}
            onChange={(e) => setShowConversion(e.target.checked)}
            className="w-auto"
          />
        </div>
        {showConversion && (
          <div className="input-group flex-col">
            <label htmlFor="cprice">
              conversion rate {quote}/{depositCurrency}
            </label>
            <input
              type="number"
              placeholder="e.g 1.1234"
              onChange={(e) => setConversionRate(parseFloat(e.target.value))}
              name="cprice"
              id="cprice"
              defaultValue={conversionRate}
            />
          </div>
        )}

        <button className="btn" onClick={handleClick}>
          Calculate
        </button>
      </div>
      <div>
        {pipValue && (
          <h2>
            Pip value: {pipValue} {depositCurrency}
          </h2>
        )}
      </div>
      <p>
        {base}/{quote}
      </p>
    </>
  );
};

export default PipCalculator;
