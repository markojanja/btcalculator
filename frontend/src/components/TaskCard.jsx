import "./TaskCard.css";

import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaAnglesUp, FaAnglesDown } from "react-icons/fa6";
import { TiEquals } from "react-icons/ti";

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
        <h4 style={{ fontSize: "20px" }}>{task.title}</h4>
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
        {task.priority === "LOW" && (
          <>
            <FaAnglesDown style={{ fill: "lime" }} />{" "}
            <span className="task-span">{task.priority}</span>
          </>
        )}
        {task.priority === "MEDIUM" && (
          <>
            <TiEquals style={{ fill: "cyan" }} /> <span className="task-span">{task.priority}</span>
          </>
        )}
        {task.priority === "HIGH" && (
          <>
            <FaAnglesUp style={{ fill: "red" }} />{" "}
            <span className="task-span">{task.priority}</span>
          </>
        )}
      </p>
      <span style={{ color: "gray", fontSize: "12px" }}>
        {new Date(task.createdAt).toLocaleString()}
      </span>
      <p style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "gray" }}>
        <CgProfile /> <span>{task.user.username}</span>
      </p>
    </div>
  );
};

export default TaskCard;
