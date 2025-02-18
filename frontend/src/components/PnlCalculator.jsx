import "./PipCalculator.css";
import { allCurrencyPairs, uniqueCurrencies } from "../utils/helpers";
import { useState } from "react";
import axios from "axios";
const PnlCalculator = () => {
  const [currencyPair, setCurrnecyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [openPrice, setOpenPrice] = useState(null);
  const [closePrice, setClosePrice] = useState(null);
  const [tradeSize, setTradeSize] = useState(1);
  const [tradeType, setTradeType] = useState("BUY");
  const [pnl, setPnl] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchData = async (pair) => {
    const res = await axios.get(
      `https://api.twelvedata.com/exchange_rate?symbol=${pair}&apikey=${API_KEY}`
    );

    return res.data.rate;
  };

  const handleOpenPrice = (e) => {
    setOpenPrice(parseFloat(e.target.value));
  };
  const handleClosePrice = (e) => {
    setClosePrice(parseFloat(e.target.value));
  };

  const handleTradeSize = (e) => {
    setTradeSize(e.target.value);
  };

  const handleCurrencySelect = (e) => {
    setCurrnecyPair(e.target.value);
  };

  const handleDepositSelect = (e) => {
    setDepositCurrency(e.target.value);
  };
  const handleTradeType = (e) => {
    setTradeType(e.target.value);
  };

  const calculatePnl = async () => {
    let contractSize = 100000;
    let conversionRate = null;
    const [, quote] = currencyPair.split("/");

    let result;
    if (tradeType === "BUY") {
      result = (closePrice - openPrice) * (tradeSize * contractSize);

      setPnl(parseFloat(result).toFixed(2));
    }
    if (tradeType === "SELL") {
      result = (openPrice - closePrice) * (tradeSize * contractSize);

      setPnl(parseFloat(result).toFixed(2));
    }
    if (quote !== depositCurrency) {
      //   console.log("apply conversion");
      setPnl("");
      let pair = `${quote}/${depositCurrency}`;
      if (!allCurrencyPairs.includes(pair)) {
        pair = `${depositCurrency}/${quote}`;
      }
      conversionRate = await fetchData(pair);

      if (depositCurrency === "JPY") {
        result = result * conversionRate;
        setPnl(parseFloat(result).toFixed(2));
      } else {
        result = result / conversionRate;
        setPnl(parseFloat(result).toFixed(2));
      }
    }
  };
  return (
    <>
      <div className="calculator">
        <h2>PnL calculator</h2>
        <div className="input-group flex-col">
          <label htmlFor="">currency pair</label>
          <select type="text" value={currencyPair} onChange={handleCurrencySelect}>
            {allCurrencyPairs.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group flex-col">
          <label htmlFor="">buy or sell</label>
          <select type="text" defaultValue={"BUY"} onChange={handleTradeType}>
            <option value={"BUY"}>BUY</option>
            <option value={"SELL"}>SELL</option>
          </select>
        </div>
        <div className="input-group flex-col">
          <label htmlFor="">open price</label>
          <input type="number" onChange={handleOpenPrice} />
        </div>
        <div className="input-group flex-col">
          <label htmlFor="">close price</label>
          <input type="number" onChange={handleClosePrice} />
        </div>
        <div className="input-group flex-col">
          <label htmlFor="">trade size (lots)</label>
          <input type="number" onChange={handleTradeSize} />
        </div>
        <div className="input-group flex-col">
          <label htmlFor="">deposit currency</label>
          <select type="text" value={depositCurrency} onChange={handleDepositSelect}>
            {uniqueCurrencies.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>
        <button onClick={calculatePnl}>Calculate</button>
      </div>
      {pnl && (
        <div className="results-display">
          <h2>
            PNL: {pnl} {depositCurrency}
          </h2>
        </div>
      )}
    </>
  );
};

export default PnlCalculator;
