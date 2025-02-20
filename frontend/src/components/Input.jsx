/* eslint-disable react/prop-types */
const Input = ({ label, placeholder, value, onChange, disabled }) => {
  return (
    <div className="input-group flex-col">
      <label htmlFor="input">{label}</label>
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        name="input"
        id="input"
        disabled={disabled}
        min={"0"}
        step={"0.0001"}
      />
    </div>
  );
};

export default Input;
