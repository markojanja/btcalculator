import Input from "./Input";
import Select from "./Select";
import CalculatorHeading from "./CalculatorHeading";
import { allCurrencyPairs, uniqueCurrencies } from "../utils/helpers";
import { useState } from "react";
import { calculateDailySwap, getDatesInRange, getTotalSwap } from "../utils/calculations";

const SwapCalculator = () => {
  const calculationType = ["money", "points", "percentage"];
  const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const tradeTypes = ["BUY", "SELL"];
  const [symbol, setSymbol] = useState("EUR/USD");
  const [contractSize, setContractSize] = useState(100000);
  const [pipSize, setPipSize] = useState(0.00001);
  const [activeCalculation, setActiveCalculation] = useState("money");
  const [activeDay, setActiveDay] = useState("Wednesday");
  const [long, setLong] = useState("");
  const [short, setShort] = useState("");
  const [deposit, setDeposit] = useState("USD");
  const [assetPrice, setAssetPrice] = useState("");
  const [lotsTraded, setLotsTraded] = useState("");
  const [tradeType, setTradeType] = useState("BUY");
  const [openDate, setOpenDate] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [result, setResult] = useState({});
  const [test, setTest] = useState(0);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleCalculateSwap = () => {
    const swapCalculation = calculateDailySwap(
      activeCalculation,
      contractSize,
      pipSize,
      long,
      short,
      lotsTraded,
      assetPrice
    );
    const dates = getDatesInRange(openDate, closeDate, activeDay);
    const dailySwap = tradeType === "BUY" ? swapCalculation.long : swapCalculation.short;
    const res = {
      symbol,
      activeCalculation,
      swapDay: activeDay,
      lotsTraded,
      assetPrice,
      tradeType,
      deposit,
      dailySwap: dailySwap,
    };

    setResult(res);
    let total = getTotalSwap(dates, dailySwap);
    setTest(total);
  };

  return (
    <>
      <div className="calculator">
        <CalculatorHeading
          title={"Swap Calculator"}
          editMode={false}
          setEditMode={null}
          visible={false}
        />
        <h4>Symbol settings</h4>
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <Select
            label={"symbol"}
            value={symbol}
            onChange={handleChange(setSymbol)}
            array={allCurrencyPairs}
          />
          <Input
            label={"contract size"}
            placeholder={"e.g. 100000"}
            value={contractSize}
            onChange={handleChange(setContractSize)}
            disabled={false}
          />
          <Input
            label={"pip size"}
            placeholder={"e.g. 0.00001"}
            value={pipSize}
            onChange={handleChange(setPipSize)}
            disabled={false}
          />
        </div>
        <h4>Swap settings</h4>
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <Select
            label={"calculation type"}
            value={activeCalculation}
            onChange={handleChange(setActiveCalculation)}
            array={calculationType}
          />
          <Select
            label={"3-day swap"}
            value={activeDay}
            onChange={handleChange(setActiveDay)}
            array={workingDays}
          />
        </div>
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <Input
            label={"long"}
            placeholder={""}
            value={long}
            onChange={handleChange(setLong)}
            disabled={false}
          />
          <Input
            label={"short"}
            placeholder={""}
            value={short}
            onChange={handleChange(setShort)}
            disabled={false}
          />
        </div>
        <h4>Trade settings</h4>
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <Select
            label={"account currnecy"}
            value={deposit}
            onChange={handleChange(setDeposit)}
            array={uniqueCurrencies}
          />
          <Select
            label={"trade type"}
            value={tradeType}
            onChange={handleChange(setTradeType)}
            array={tradeTypes}
          />
        </div>
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <Input
            label={"asset price"}
            placeholder={"e.g. 1.03425"}
            value={assetPrice}
            onChange={handleChange(setAssetPrice)}
            disabled={false}
          />
          <Input
            label={"lots"}
            placeholder={"e.g. 0.01"}
            value={lotsTraded}
            onChange={handleChange(setLotsTraded)}
            disabled={false}
          />
        </div>
        <div style={{ display: "flex", flex: "1", width: "100%", gap: "1rem" }}>
          <div className="input-group flex-col">
            <label htmlFor="">date open</label>
            <input type="date" onChange={handleChange(setOpenDate)} />
          </div>
          <div className="input-group flex-col">
            <label htmlFor="">date close</label>
            <input type="date" onChange={handleChange(setCloseDate)} />
          </div>
        </div>
        <button onClick={handleCalculateSwap}>Calculate</button>
      </div>
      {result && (
        <div className="results-display">
          <h4>Symbol: {result.symbol}</h4>
          <h4>Calculation Type: {result.activeCalculation}</h4>
          <h4>3-day Swap: {result.swapDay}</h4>
          <h4>Asset Price{result.assetPrice}</h4>
          <h4>Lots: {result.lotsTraded}</h4>
          <h4>
            Daily swap {parseFloat(result.dailySwap).toFixed(3)}{" "}
            {result.dailySwap < 0 ? "is charged" : "is paid"}
          </h4>
          <h4>
            TotalSwaps:{parseFloat(test).toFixed(3)} {`from ${openDate} to ${closeDate} `}{" "}
            {test < 0 ? "is being charged" : "is paid"}
          </h4>
        </div>
      )}
    </>
  );
};

export default SwapCalculator;
