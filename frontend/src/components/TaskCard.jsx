import "./TaskCard.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const TaskCard = ({ task, onDragStart, handleDeleteTask, handleEditModal, setActiveTask }) => {
  const handleDelete = () => {
    handleDeleteTask(task);
  };

  const toggleModal = (task) => {
    handleEditModal();
    setActiveTask(task);
    console.log(task);
  };

  return (
    <div className="task-card" draggable onDragStart={() => onDragStart(task)}>
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <div className="tasks-btn-group">
          <FaRegEdit onClick={() => toggleModal(task)} />
          <MdDeleteOutline onClick={handleDelete} />
        </div>
      </div>
      <p style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <CgProfile /> <span>Marko janjic</span>
      </p>
    </div>
  );
};

export default TaskCard;
