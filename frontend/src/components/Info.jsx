import { IoMdInformationCircleOutline } from "react-icons/io";

const Info = ({ editMode }) => {
  return (
    <div>
      {editMode ? (
        <div className="info">
          <IoMdInformationCircleOutline size={"20"} />
          <p>Edit mode is on, fill in the required fields.</p>
        </div>
      ) : (
        <div className="info">
          <IoMdInformationCircleOutline size={"20"} />
          <p>Edit mode is off, prices are fetched online.</p>
        </div>
      )}
    </div>
  );
};

export default Info;
