import { MdOutlineSettingsInputComposite } from "react-icons/md";

const SettingsButton = ({ editMode, setEditMode }) => {
  const handleClick = () => {
    setEditMode(!editMode);
  };
  return (
    <button className="settings-btn" onClick={handleClick}>
      <MdOutlineSettingsInputComposite
        color={editMode ? "oklch(0.777 0.152 181.912)!important;" : "#ffffff"}
        size={"20px"}
      />
    </button>
  );
};

export default SettingsButton;
