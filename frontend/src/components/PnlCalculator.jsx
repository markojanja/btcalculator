import { useState } from "react";
import axios from "axios";
import ResultsDisplay from "./ResultsDisplay";
import CardHeading from "./CardHeading";
import Input from "./Input";
import Select from "./Select";
import Info from "./Info";
import Modal from "./Modal";
import { allCurrencyPairs, uniqueCurrencies, tradeTypeList, pnlHowTo } from "../utils/helpers";

const PnlCalculator = () => {
  const [currencyPair, setCurrnecyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [openPrice, setOpenPrice] = useState("");
  const [closePrice, setClosePrice] = useState("");
  const [tradeSize, setTradeSize] = useState(1);
  const [tradeType, setTradeType] = useState("BUY");
  const [pnl, setPnl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [conversionRate, setConverisonRate] = useState("");
  const [showModal, setShowModal] = useState(false);

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
      setPnl("");
      let pair = `${quote}/${depositCurrency}`;

      if (!allCurrencyPairs.includes(pair)) {
        pair = `${depositCurrency}/${quote}`;
      }
      let conversion = await fetchData(pair);

      if (conversionRate) {
        conversion = conversionRate;
      }

      if (depositCurrency === "JPY") {
        result = result * conversion;
        setPnl(parseFloat(result).toFixed(2));
      } else {
        result = result / conversion;
        setPnl(parseFloat(result).toFixed(2));
      }
    }
  };
  return (
    <>
      {showModal && <Modal setShowModal={setShowModal} content={pnlHowTo} />}
      <Info editMode={editMode} />
      <div className={`calculator ${editMode ? "active-border" : ""}`}>
        <CardHeading
          title={"PnL Calculator"}
          editMode={editMode}
          setEditMode={setEditMode}
          visible={true}
          setShowModal={setShowModal}
        />
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
          <Select
            label={"buy or sell"}
            value={tradeType}
            onChange={handleTradeType}
            array={tradeTypeList}
          />
        </div>
        <div className="input-group flex-col">
          <Input
            label={"open price"}
            placeholder={"example: 1.03215"}
            value={openPrice}
            onChange={handleOpenPrice}
            disabled={false}
          />
        </div>
        <div className="input-group flex-col">
          <Input
            label={"close price"}
            placeholder={"example: 1.03218"}
            value={closePrice}
            onChange={handleClosePrice}
            disabled={false}
          />
        </div>
        <div className="input-group flex-col">
          <Input
            label={"trade size(lots)"}
            placeholder={"example: 0.01"}
            value={tradeSize}
            onChange={handleTradeSize}
            disabled={false}
          />
        </div>
        <div className="input-group flex-col">
          <Select
            label={"account currency"}
            value={depositCurrency}
            onChange={handleDepositSelect}
            array={uniqueCurrencies}
          />
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
