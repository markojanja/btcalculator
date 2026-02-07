import { MdOutlineSettingsInputComposite } from "react-icons/md";

const SettingsButton = ({ editMode, setEditMode }) => {
  const handleClick = () => {
    setEditMode(!editMode);
  };
  return (
    <button
      className={!editMode ? "text-white" : "text-primary"}
      onClick={handleClick}
    >
      <MdOutlineSettingsInputComposite size={"20px"} />
    </button>
  );
};

export default SettingsButton;
