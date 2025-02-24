import Input from "./Input";
import Select from "./Select";
import CalculatorHeading from "./CalculatorHeading";
import "./PipCalculator.css";
import ButtonGroup from "./ButtonGroup";
import { useState } from "react";
import { marginCalculationCFD, marginCalculationForex } from "../utils/calculations";
import { allCurrencyPairs } from "../utils/helpers";

const MarginCalculator = () => {
  const [activeType, setActveType] = useState("forex");
  const [calculations, setCalculations] = useState([]);
  const [contractSize, setContractSize] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState("");
  const [margin, setMargin] = useState("");
  const [pair, setPair] = useState("EUR/AUD");
  const [tradeType, setTradeType] = useState("BUY");

  const handleTypeSelect = (e) => {
    setActveType(e.target.value);
    console.log(activeType);
  };

  const handleContractSize = (e) => {
    setContractSize(e.target.value);
  };
  const handleLotSize = (e) => {
    setLotSize(e.target.value);
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
  };
  const handleLeverage = (e) => {
    setLeverage(e.target.value);
  };
  const handleMargin = (e) => {
    setMargin(e.target.value);
  };

  const handlePairSelect = (e) => {
    setPair(e.target.value);
  };
  const handleTradeTypeSelect = (e) => {
    setTradeType(e.target.value);
  };
  const handleCalculate = () => {
    let res;
    let newPair;

    if (activeType === "forex") {
      setMargin("-");
      res = marginCalculationForex(contractSize, lotSize, price, leverage);
      newPair = {
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin: "-",
        leverage,
        marginRequired: parseFloat(res.toFixed(2)),
      };
    } else if (activeType === "cfd") {
      setLeverage("-");
      res = marginCalculationCFD(contractSize, lotSize, price, margin);
      newPair = {
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin,
        leverage: "-",
        marginRequired: parseFloat(res.toFixed(2)),
      };
    } else {
      console.log("error");
      return;
    }

    setCalculations([...calculations, newPair]);
  };

  const calcType = ["forex", "cfd"];
  const tradeTypeList = ["BUY", "SELL"];

  return (
    <>
      <div className="calculator">
        <CalculatorHeading
          title={"Margin Calculator"}
          editMode={false}
          setEditMode={null}
          visible={false}
        />
        <ButtonGroup array={calcType} activeType={activeType} onClick={handleTypeSelect} />
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <Select
            label={"symbol"}
            value={pair}
            onChange={handlePairSelect}
            array={allCurrencyPairs}
          />
          <Select
            label={"type"}
            value={tradeType}
            onChange={handleTradeTypeSelect}
            array={tradeTypeList}
          />
        </div>
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <Input
            label={"contract size"}
            placeholder={"e.g. 100000"}
            value={contractSize}
            onChange={handleContractSize}
            disabled={false}
          />
          <Input
            label={"lot size"}
            placeholder={"e.g 0.01"}
            value={lotSize}
            onChange={handleLotSize}
            disabled={false}
          />
        </div>
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <Input
            label={"price"}
            placeholder={"price of instrument"}
            value={price}
            onChange={handlePrice}
            disabled={false}
          />
          {activeType === "forex" && (
            <Input
              label={"leverage"}
              placeholder={"e.g 100"}
              value={leverage}
              onChange={handleLeverage}
              disabled={false}
            />
          )}
          {activeType === "cfd" && (
            <Input
              label={"margin (%)"}
              placeholder={"e.g 5"}
              value={margin}
              onChange={handleMargin}
              disabled={false}
            />
          )}
        </div>
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      {calculations.length > 0 && (
        <div className="results-display" style={{ width: "50%" }}>
          <table className="calculation-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>type</th>
                <th>Contract Size</th>
                <th>Lot Size</th>
                <th>Price</th>
                <th>Margin(%)</th>
                <th>Leverage</th>
                <th>Margin Required</th>
              </tr>
            </thead>
            <tbody>
              {calculations.map((calc, index) => (
                <tr key={index}>
                  <td>{calc.pair}</td>
                  <td>{calc.tradeType}</td>
                  <td>{calc.contractSize}</td>
                  <td>{calc.lotSize}</td>
                  <td>{calc.price}</td>
                  <td>{calc.margin}</td>
                  <td>{calc.leverage}</td>
                  <td>{calc.marginRequired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MarginCalculator;
