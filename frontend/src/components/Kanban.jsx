import "./Kanban.css";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import AddTaskModal from "./AddTaskModal.jsx";
import EditTask from "./EditTask.jsx";
import useKanban from "../hooks/useKanban.jsx";

const Kanban = () => {
  const { columns, activeTask, taskModal, editModal, setColumns } = useKanban();

  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = (targetStatus) => {
    if (!draggedTask) return;

    if (draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    setColumns((prevCols) =>
      prevCols.map((col) => {
        if (col.colStatus === draggedTask.status) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== draggedTask.id),
          };
        }
        if (col.colStatus === targetStatus) {
          return {
            ...col,
            tasks: [...col.tasks, { ...draggedTask, status: targetStatus }],
          };
        }
        return col;
      })
    );

    setDraggedTask(null);
  };

  if (taskModal) {
    return <AddTaskModal />;
  }

  if (editModal && activeTask) {
    return <EditTask />;
  }

  return (
    <div className="kanban-wrapper">
      {columns.map((col, idx) => (
        <KanbanColumn
          key={idx}
          column={col}
          name={col.title}
          tasks={col.tasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};

export default Kanban;
