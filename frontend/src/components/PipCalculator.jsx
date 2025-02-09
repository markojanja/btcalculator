import "./PipCalculator.css";
import { useState, useEffect } from "react";

const PipCalculator = () => {
  const [positionSize, setPositionSize] = useState(100000);
  const [pipSize, setPipSize] = useState(0.0001);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [pipValue, setPipValue] = useState(null);
  const [showConversion, setShowConversion] = useState(false);
  const [conversionRate, setConversionRate] = useState(null);

  useEffect(() => {
    if (showConversion) {
      setExchangeRate(1);
    }
  }, [showConversion]);

  const calculatePipValue = () => {
    const res = (pipSize * positionSize) / exchangeRate;
    return res % 1 === 0 ? res : parseFloat(res.toFixed(6));
  };

  const pipValueWithConversion = () => {
    const calculatedPipvalue = calculatePipValue();
    if (showConversion) {
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
          <label htmlFor="price">exchangeRate</label>
          <input
            type="number"
            defaultValue={exchangeRate}
            placeholder="e.g 1.1234"
            onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
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
            <label htmlFor="cprice">conversion rate</label>
            <input
              type="number"
              placeholder="e.g 1.1234"
              onChange={(e) => setConversionRate(parseFloat(e.target.value))}
              name="cprice"
              id="cprice"
            />
          </div>
        )}

        <button className="btn" onClick={handleClick}>
          Calculate
        </button>
      </div>
      <div>{pipValue && <h2>Pip value: {pipValue}</h2>}</div>
    </>
  );
};

export default PipCalculator;
