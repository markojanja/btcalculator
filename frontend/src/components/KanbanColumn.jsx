import "./KanbanColumn.css";
import TaskCard from "./TaskCard";
import { FaPlus } from "react-icons/fa";

const KanbanColumn = ({ name, setTaskModal }) => {
  const handleToggleModal = () => {
    setTaskModal(true);
  };

  return (
    <div className="kanban-column">
      <div className="kanban-header">
        <h3 style={{ alignSelf: "start" }}>{name}</h3>
        <FaPlus onClick={handleToggleModal} />
      </div>
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <button
        className="kanban-btn"
        style={{ color: "white!important" }}
        onClick={handleToggleModal}
      >
        <FaPlus color="white!important" />
      </button>
    </div>
  );
};

export default KanbanColumn;
