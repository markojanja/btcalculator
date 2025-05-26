import "./KanbanColumn.css";
import TaskCard from "./TaskCard";
import { FaPlus } from "react-icons/fa";

const KanbanColumn = ({ name, column, setTaskModal, onDragStart, onDrop }) => {
  const handleToggleModal = () => {
    setTaskModal(true);
  };

  return (
    <div
      className="kanban-column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(column.colStatus)}
    >
      <div className="kanban-header">
        <h3 style={{ alignSelf: "start" }}>{name}</h3>
        <FaPlus onClick={handleToggleModal} />
      </div>

      {column.tasks.map((task) => (
        <TaskCard key={task.id} task={task} taskItem={task} onDragStart={onDragStart} />
      ))}

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
