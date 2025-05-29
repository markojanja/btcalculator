import "./Kanban.css";
import KanbanColumn from "./KanbanColumn";
import { data as dbdata } from "../utils/dummyData.js";
import { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal.jsx";
import EditTask from "./EditTask.jsx";

const Kanban = ({ taskModal, setTaskModal, editModal, setEditModal }) => {
  const [data, setData] = useState(dbdata);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const handleAddTask = (newTask) => {
    setData((prevCols) => {
      const updatedCols = prevCols.map((col) => {
        if (col.colStatus === newTask.status) {
          return { ...col, tasks: [...col.tasks, newTask] };
        }
        return col;
      });

      return updatedCols;
    });
  };

  const handleDeleteTask = (task) => {
    setData((prevCols) => {
      const updatedCols = prevCols.map((col) => {
        const updatedTasks = col.tasks.filter((t) => t.id !== task.id);
        return { ...col, tasks: updatedTasks };
      });
      return updatedCols;
    });
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = (targetStatus) => {
    if (!draggedTask) return;

    if (draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    setData((prevCols) =>
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
  const [activeTask, setActiveTask] = useState("");

  if (taskModal) {
    return <AddTaskModal setTaskModal={setTaskModal} handleAddTask={handleAddTask} />;
  }

  if (editModal && activeTask) {
    return <EditTask handleEditModal={handleEditModal} activeTask={activeTask} />;
  }

  return (
    <div className="kanban-wrapper">
      {data.map((col, idx) => (
        <KanbanColumn
          key={idx}
          column={col}
          name={col.title}
          tasks={col.tasks}
          setTaskModal={setTaskModal}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          handleAddTask={handleAddTask}
          handleDeleteTask={handleDeleteTask}
          handleEditModal={handleEditModal}
          activeTask={activeTask}
          setActiveTask={setActiveTask}
        />
      ))}
    </div>
  );
};

export default Kanban;
