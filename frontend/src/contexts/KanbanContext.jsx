import { createContext, useState, useEffect } from "react";
import { data } from "../utils/dummyData.js";

const KanbanContext = createContext(null);

const KanbanContextProvider = ({ children }) => {
  const [columns, setColumns] = useState(data);
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [activeTask, setActiveTask] = useState("");

  useEffect(() => {
    console.log(columns);
  }, [columns]);

  const toggleAddTaskModal = () => {
    setTaskModal(!taskModal);
    console.log("helloAdd");
  };

  const toggleEditTaskModal = () => {
    console.log("helloEdit");
    setEditModal(!editModal);
  };

  const addTask = (newTask) => {
    setColumns((prevCols) => {
      const updatedCols = prevCols.map((col) => {
        if (col.colStatus === newTask.status) {
          return { ...col, tasks: [...col.tasks, newTask] };
        }
        return col;
      });

      return updatedCols;
    });
  };

  const updateTask = (updatedTask) => {
    setColumns((prevCols) => {
      return prevCols.map((col) => {
        const updatedTasks = col.tasks.map((task) => {
          return task.id === updatedTask.id ? { ...task, ...updatedTask } : task;
        });
        return { ...col, tasks: updatedTasks };
      });
    });
  };

  const deleteTask = (task) => {
    setColumns((prevCols) => {
      const updatedCols = prevCols.map((col) => {
        const updatedTasks = col.tasks.filter((t) => t.id !== task.id);
        return { ...col, tasks: updatedTasks };
      });
      return updatedCols;
    });
  };

  const value = {
    columns,
    activeTask,
    setActiveTask,
    taskModal,
    toggleAddTaskModal,
    editModal,
    toggleEditTaskModal,
    addTask,
    updateTask,
    deleteTask,
    setColumns,
  };

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};

export { KanbanContext, KanbanContextProvider };
