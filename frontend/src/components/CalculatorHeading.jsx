import SettingsButton from "./SettingsButton";

const CalculatorHeading = ({ title, editMode, setEditMode, visible }) => {
  return (
    <div className="calculator-heading">
      <h2>{title}</h2>
      {visible && <SettingsButton editMode={editMode} setEditMode={setEditMode} />}
    </div>
  );
};

export default CalculatorHeading;
