import Input from "./Input";
import Select from "./Select";
import CalculatorHeading from "./CalculatorHeading";
import "./PipCalculator.css";
import ButtonGroup from "./ButtonGroup";
import { useState } from "react";
import { marginCalculationCFD, marginCalculationForex } from "../utils/calculations";
import { allCurrencyPairs } from "../utils/helpers";
import { MdDeleteForever } from "react-icons/md";

const MarginCalculator = () => {
  const [activeType, setActveType] = useState("forex");
  const [calculations, setCalculations] = useState([]);
  const [contractSize, setContractSize] = useState(100000);
  const [lotSize, setLotSize] = useState(1);
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState(100);
  const [margin, setMargin] = useState("");
  const [pair, setPair] = useState("EUR/USD");
  const [tradeType, setTradeType] = useState("BUY");
  const [showConversion, setShowConversion] = useState(false);
  const [conversion, setConversion] = useState("");

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
        id: Date.now(),
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin: "-",
        leverage,
        marginRequired: showConversion ? parseFloat(res) * conversion : parseFloat(res),
      };
    } else if (activeType === "cfd") {
      setLeverage("-");
      res = marginCalculationCFD(contractSize, lotSize, price, margin);
      newPair = {
        id: Date.now(),
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin,
        leverage: "-",
        marginRequired: showConversion ? parseFloat(res) * conversion : parseFloat(res),
      };
    } else {
      console.log("error");
      return;
    }

    setCalculations([...calculations, newPair]);
  };

  const handleCoversion = (e) => {
    setConversion(e.target.value);
  };

  const handleCheckbox = () => {
    setShowConversion(!showConversion);
  };

  const handleDelete = (id) => {
    const newCalc = calculations.filter((item) => item.id !== id);
    setCalculations(newCalc);
  };

  const calcType = ["forex", "cfd"];
  const tradeTypeList = ["BUY", "SELL"];

  const totalPrice = calculations
    .map((item) => item.marginRequired)
    .reduce((sum, margin) => sum + margin, 0);

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
        <div className="input-group flex-col">
          <label htmlFor="checkbox">show conversion rate</label>
          <input
            id="checkbox"
            type="checkbox"
            checked={showConversion}
            disabled={false}
            onChange={handleCheckbox}
            className="w-auto"
          />
        </div>
        {showConversion && (
          <Input
            label={"converison rate"}
            placeholder={"base/deposit e.q EUR/AUD"}
            value={conversion}
            onChange={handleCoversion}
            disabled={false}
          />
        )}
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      {calculations.length > 0 && (
        <div style={{ width: "60%", margin: "0 auto" }}>
          <table className="calculation-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>type</th>
                <th>Lot Size</th>
                <th>Price</th>
                <th>Margin(%)</th>
                <th>Leverage</th>
                <th>Margin Required</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {calculations.map((calc, index) => (
                <tr key={index}>
                  <td>{calc.pair}</td>
                  <td>{calc.tradeType}</td>
                  <td>{calc.lotSize}</td>
                  <td>{calc.price}</td>
                  <td>{calc.margin}</td>
                  <td>{calc.leverage}</td>
                  <td>{parseFloat(calc.marginRequired.toFixed(2))}</td>
                  <td>
                    <MdDeleteForever
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(calc.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 style={{ marginInline: "auto 0", textAlign: "right", padding: "0.5rem 0" }}>
            Total margin:{" "}
            <span
              style={{ fontWeight: "900", color: "oklch(0.723 0.219 149.579)", fontSize: "1.3em" }}
            >
              {parseFloat(totalPrice).toFixed(2)}
            </span>
          </h4>
        </div>
      )}
    </>
  );
};

export default MarginCalculator;
