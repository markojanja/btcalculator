import SettingsButton from "./SettingsButton";

const CalculatorHeading = ({ title, editMode, setEditMode }) => {
  return (
    <div className="calculator-heading">
      <h2>{title}</h2>
      <SettingsButton editMode={editMode} setEditMode={setEditMode} />
    </div>
  );
};

export default CalculatorHeading;
