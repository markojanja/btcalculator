const Select = ({ label, value, onChange, array }) => {
  return (
    <div className="input-group flex-col">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {array.map((pair) => (
          <option key={pair} value={pair}>
            {pair}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
