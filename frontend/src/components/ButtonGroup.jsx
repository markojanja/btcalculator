const ButtonGroup = ({ array, activeType, onClick }) => {
  return (
    <div className="button-group">
      <p className="label">type of calculation</p>
      <div className="group-inline">
        {array.map((item) => (
          <button
            key={item}
            className={activeType !== item ? "btn-outline" : "btn-outline selected"}
            value={item}
            onClick={onClick}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
