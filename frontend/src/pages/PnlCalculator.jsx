import { useState } from "react";
import axios from "axios";
import ResultsDisplay from "../components/ResultsDisplay";
import CardHeading from "../components/CardHeading";
import Input from "../components/Input";
import Select from "../components/Select";
import Info from "../components/Info";
import Modal from "../components/Modal";
import {
  allCurrencyPairs,
  uniqueCurrencies,
  tradeTypeList,
  pnlHowTo,
} from "../utils/helpers";
import { calculateProfitAndLoss } from "../utils/calculations";

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
  const [contractSize, setContractSize] = useState(100000);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchData = async (pair) => {
    const res = await axios.get(
      `https://api.twelvedata.com/exchange_rate?symbol=${pair}&apikey=${API_KEY}`
    );

    return res.data.rate;
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const calculatePnl = async () => {
    const [, quote] = currencyPair.split("/");

    let result = calculateProfitAndLoss(
      openPrice,
      closePrice,
      tradeSize,
      contractSize,
      tradeType
    );
    setPnl(parseFloat(result).toFixed(2));

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

      result = result * conversion;
      setPnl(parseFloat(result).toFixed(2));
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
        {editMode ? (
          <div className="input-group flex-col">
            <label>symbol</label>
            <input
              type="text"
              value={currencyPair}
              placeholder={""}
              onChange={handleChange(setCurrnecyPair)}
              name="input"
              disabled={false}
            />
          </div>
        ) : (
          <div className="input-group flex-col">
            <Select
              label={"symbol"}
              value={currencyPair}
              onChange={handleChange(setCurrnecyPair)}
              array={allCurrencyPairs}
            />
          </div>
        )}

        <div className="input-group flex-col">
          <Input
            label={"contract size"}
            placeholder={"100000"}
            value={contractSize}
            onChange={handleChange(setContractSize)}
            disabled={false}
          />
        </div>

        <div className="input-group flex-col">
          <Select
            label={"buy or sell"}
            value={tradeType}
            onChange={handleChange(setTradeType)}
            array={tradeTypeList}
          />
        </div>
        <div className="input-group flex-col">
          <Input
            label={"open price"}
            placeholder={"example: 1.03215"}
            value={openPrice}
            onChange={handleChange(setOpenPrice)}
            disabled={false}
          />
        </div>
        <div className="input-group flex-col">
          <Input
            label={"close price"}
            placeholder={"example: 1.03218"}
            value={closePrice}
            onChange={handleChange(setClosePrice)}
            disabled={false}
          />
        </div>
        <div className="input-group flex-col">
          <Input
            label={"trade size(lots)"}
            placeholder={"example: 0.01"}
            value={tradeSize}
            onChange={handleChange(setTradeSize)}
            disabled={false}
          />
        </div>
        <div className="input-group flex-col">
          <Select
            label={"account currency"}
            value={depositCurrency}
            onChange={handleChange(setDepositCurrency)}
            array={uniqueCurrencies}
          />
        </div>
        {editMode && (
          <Input
            label={"currency conversion pair price"}
            placeholder={"e.g. price of USD/JPY"}
            onChange={handleChange(setConverisonRate)}
            disabled={false}
          />
        )}
        <button onClick={calculatePnl}>Calculate</button>
      </div>
      {pnl && (
        <ResultsDisplay
          text={"PNL"}
          value={pnl}
          depositCurrency={depositCurrency}
        />
      )}
    </>
  );
};

export default PnlCalculator;
