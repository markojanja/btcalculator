/* eslint-disable react/prop-types */
const ResultsDisplay = ({ text, value, depositCurrency }) => {
  return (
    <div className="results-display">
      <h2>
        {text}: {value} {depositCurrency}
      </h2>
    </div>
  );
};

export default ResultsDisplay;
