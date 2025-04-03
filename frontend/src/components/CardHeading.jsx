import SettingsButton from "./SettingsButton";
import { FaRegQuestionCircle } from "react-icons/fa";

const CardHeading = ({ title, editMode, setEditMode, visible, setShowModal }) => {
  const handleToggleModal = () => {
    setShowModal(true);
  };
  return (
    <div className="calculator-heading">
      <h2>{title}</h2>
      <div className="header-btn" onClick={handleToggleModal}>
        <FaRegQuestionCircle style={{ cursor: "pointer" }} />
      </div>
      {visible && <SettingsButton editMode={editMode} setEditMode={setEditMode} />}
    </div>
  );
};

export default CardHeading;
