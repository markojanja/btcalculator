import "./TaskCard.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const TaskCard = () => {
  return (
    <div className="task-card" draggable>
      <div className="task-card-header">
        <h4>Task title</h4>
        <div className="tasks-btn-group">
          <FaRegEdit />
          <MdDeleteOutline />
        </div>
      </div>
      <p style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <CgProfile /> <span>Marko janjic</span>
      </p>
    </div>
  );
};

export default TaskCard;
