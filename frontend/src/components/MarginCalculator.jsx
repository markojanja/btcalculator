import Input from "./Input";
import CalculatorHeading from "./CalculatorHeading";
import "./PipCalculator.css";
import ButtonGroup from "./ButtonGroup";
import { useState } from "react";
import { marginCalculationCFD, marginCalculationForex } from "../utils/calculations";

const MarginCalculator = () => {
  const [activeType, setActveType] = useState("forex");
  const [calculations, setCalculations] = useState([]);
  const [contractSize, setContractSize] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState("");
  const [margin, setMargin] = useState("");

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

  const handleCalculate = () => {
    let res;
    let newPair;

    if (activeType === "forex") {
      setMargin("-");
      res = marginCalculationForex(contractSize, lotSize, price, leverage);
      newPair = {
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

    setCalculations([...calculations, newPair]); // Correct state update
    console.log([...calculations, newPair]); // Logs updated state
  };

  const calcType = ["forex", "cfd"];

  return (
    <>
      <div className="calculator">
        <CalculatorHeading title={"Margin Calculator"} editMode={false} setEditMode={null} />
        <ButtonGroup array={calcType} activeType={activeType} onClick={handleTypeSelect} />
        <Input
          label={"contract size"}
          placeholder={"1000"}
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
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      {calculations.length > 0 && (
        <div className="results-display" style={{ width: "50%" }}>
          <table className="calculation-table">
            <thead>
              <tr>
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
