import "./TaskCard.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import useKanban from "../hooks/useKanban";

const TaskCard = ({ task, onDragStart }) => {
  const { toggleEditTaskModal, deleteTask, setActiveTask } = useKanban();

  const toggleModal = (task) => {
    setActiveTask(task);
    toggleEditTaskModal();
    console.log(task);
  };

  return (
    <div className="task-card" draggable onDragStart={() => onDragStart(task)}>
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <div className="tasks-btn-group">
          <FaRegEdit onClick={() => toggleModal(task)} />
          <MdDeleteOutline
            onClick={() => {
              deleteTask(task);
            }}
          />
        </div>
      </div>
      <p
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          textTransform: "lowercase",
          color: "gray",
        }}
      >
        priority: <span>{task.priority}</span>
      </p>
      <p style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "gray" }}>
        <CgProfile /> <span>{task.user.username}</span>
      </p>
    </div>
  );
};

export default TaskCard;
