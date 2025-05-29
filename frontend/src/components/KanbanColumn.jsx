import "./KanbanColumn.css";
import TaskCard from "./TaskCard";
import { FaPlus } from "react-icons/fa";

const KanbanColumn = ({
  name,
  column,
  setTaskModal,
  onDragStart,
  onDrop,
  handleDeleteTask,
  handleEditModal,
  setActiveTask,
}) => {
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
        <h4 style={{ alignSelf: "start" }}>{name}</h4>

        <FaPlus onClick={handleToggleModal} />
      </div>

      {column.tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          taskItem={task}
          onDragStart={onDragStart}
          handleDeleteTask={handleDeleteTask}
          handleEditModal={handleEditModal}
          setActiveTask={setActiveTask}
        />
      ))}
    </div>
  );
};

export default KanbanColumn;
