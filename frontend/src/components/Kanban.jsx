import "./Kanban.css";
import KanbanColumn from "./KanbanColumn";
import { data as dbdata } from "../utils/dummyData.js";
import { useEffect, useState } from "react";

const Kanban = ({ setTaskModal }) => {
  const [data, setData] = useState(dbdata);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
        />
      ))}
    </div>
  );
};

export default Kanban;
