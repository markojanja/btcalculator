import "./Kanban.css";
import axios from "axios";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import AddTaskModal from "./AddTaskModal.jsx";
import EditTask from "./EditTask.jsx";
import useKanban from "../hooks/useKanban.jsx";

const Kanban = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { columns, activeTask, taskModal, editModal, setColumns } = useKanban();

  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (targetStatus) => {
    if (!draggedTask) return;

    if (draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    const updatedTask = { ...draggedTask, status: targetStatus };

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

    try {
      await axios.put(`${BACKEND_URL}/tasks/edit_task`, updatedTask, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Optionally rollback the optimistic UI update or notify the user
    }
  };

  if (taskModal) {
    return <AddTaskModal />;
  }

  if (editModal && activeTask) {
    return <EditTask />;
  }

  return (
    <div className="kanban-wrapper">
      {columns.map((col) => (
        <KanbanColumn
          key={col.colStatus}
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
