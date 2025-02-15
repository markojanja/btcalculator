import "./PipCalculator.css";
import { allCurrencyPairs, uniqueCurrencies } from "../utils/helpers";
import { useState } from "react";
const PnlCalculator = () => {
  const [currencyPair, setCurrnecyPair] = useState("EURUSD");
  const [depositCurrency, setDepositCurrency] = useState("USD");

  const handleCurrencySelect = (e) => {
    setCurrnecyPair(e.target.value);
  };

  const handleDepositSelect = (e) => {
    setDepositCurrency(e.target.value);
  };
  return (
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
        <label htmlFor="">open price</label>
        <input type="number" />
      </div>
      <div className="input-group flex-col">
        <label htmlFor="">close price</label>
        <input type="number" />
      </div>
      <div className="input-group flex-col">
        <label htmlFor="">trade size (lots)</label>
        <input type="number" />
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
      <button>Calculate</button>
    </div>
  );
};

export default PnlCalculator;
