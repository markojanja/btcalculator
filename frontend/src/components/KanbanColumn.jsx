import useKanban from "../hooks/useKanban";
import "./KanbanColumn.css";
import TaskCard from "./TaskCard";
import { FaPlus } from "react-icons/fa";

const KanbanColumn = ({ name, column, onDragStart, onDrop }) => {
  const { toggleAddTaskModal } = useKanban();

  return (
    <div
      className="kanban-column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(column.colStatus)}
    >
      <div className="kanban-header">
        <h4 style={{ alignSelf: "start" }}>
          {name} <span>{column.tasks.length}</span>
        </h4>

        {name !== "COMPLETED" && <FaPlus onClick={() => toggleAddTaskModal()} />}
      </div>

      {column.tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
      ))}
    </div>
  );
};

export default KanbanColumn;
