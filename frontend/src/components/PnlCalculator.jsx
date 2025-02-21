import "./PipCalculator.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { allCurrencyPairs, uniqueCurrencies } from "../utils/helpers";
import ResultsDisplay from "./ResultsDisplay";
import { useState } from "react";
import axios from "axios";
import CalculatorHeading from "./CalculatorHeading";
import Input from "./Input";
const PnlCalculator = () => {
  const [currencyPair, setCurrnecyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [openPrice, setOpenPrice] = useState(null);
  const [closePrice, setClosePrice] = useState(null);
  const [tradeSize, setTradeSize] = useState(1);
  const [tradeType, setTradeType] = useState("BUY");
  const [pnl, setPnl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [conversionRate, setConverisonRate] = useState("");

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
  const handleConverisonPrice = (e) => {
    setConverisonRate(e.target.value);
  };
  const calculatePnl = async () => {
    let contractSize = 100000;
    let conversion = null;
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
      conversion = await fetchData(pair);

      setConverisonRate(conversion);

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
      {editMode ? (
        <div className="info">
          <IoMdInformationCircleOutline size={"20"} />
          <p>Edit mode is on, fill in the required fields.</p>
        </div>
      ) : (
        <div className="info">
          <IoMdInformationCircleOutline size={"20"} />
          <p>Edit mode is off, prices are fetched online.</p>
        </div>
      )}
      <div className={`calculator ${editMode ? "active-border" : ""}`}>
        <CalculatorHeading title={"PnL Calculator"} editMode={editMode} setEditMode={setEditMode} />
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
        {editMode && (
          <Input
            label={"currency conversion pair price"}
            placeholder={"e.g. price of USD/JPY"}
            onChange={handleConverisonPrice}
            disabled={false}
          />
        )}
        <button onClick={calculatePnl}>Calculate</button>
      </div>
      {pnl && <ResultsDisplay text={"PNL"} value={pnl} depositCurrency={depositCurrency} />}
    </>
  );
};

export default PnlCalculator;
