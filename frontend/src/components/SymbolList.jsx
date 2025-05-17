const SymbolList = ({ symbols }) => {
  return (
    <ul className="flex-col symbol-list">
      {symbols.map((symbol) => (
        <li key={symbol}>{symbol}</li>
      ))}
    </ul>
  );
};

export default SymbolList;
