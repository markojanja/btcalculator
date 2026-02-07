import { createContext, useState, useEffect } from "react";
import axios from "axios";
import useNotification from "../hooks/useNotification";

const KanbanContext = createContext(null);

const KanbanContextProvider = ({ children }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [columns, setColumns] = useState([]);
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [activeTask, setActiveTask] = useState("");
  const { lastEvent } = useNotification();

  const getTasks = async () => {
    const res = await axios.get(`${BACKEND_URL}/tasks/my_tasks`, {
      withCredentials: true,
    });
    console.log(res.data);
    setColumns(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (!lastEvent) return;

    if (
      lastEvent.type === "TASK_UPDATED" ||
      lastEvent.type === "TASK_CREATED" ||
      lastEvent.tpe === "TASK_ASSIGNED"
    ) {
      console.log("Refreshing kanban because of notification");
      getTasks(); // your existing function
    }
  }, [lastEvent]);

  const toggleAddTaskModal = () => {
    setTaskModal(!taskModal);
  };

  const toggleEditTaskModal = () => {
    setEditModal(!editModal);
  };

  const addTask = (newTask) => {
    setColumns((prevCols) => {
      const updatedCols = prevCols.map((col) => {
        if (col.colStatus === newTask.status) {
          const updated = { ...col, tasks: [...col.tasks, newTask] };
          console.log("Added task to column:", updated);
          return updated;
        }
        return col;
      });

      console.log("Updated columns:", updatedCols);
      return updatedCols;
    });
  };

  const updateTask = (updatedTask) => {
    setColumns((prevCols) => {
      return prevCols.map((col) => {
        const updatedTasks = col.tasks.map((task) => {
          return task.id === updatedTask.id
            ? { ...task, ...updatedTask }
            : task;
        });
        return { ...col, tasks: updatedTasks };
      });
    });
  };

  const deleteTask = async (task) => {
    console.log(task.id);
    setColumns((prevCols) => {
      const updatedCols = prevCols.map((col) => {
        const updatedTasks = col.tasks.filter((t) => t.id !== task.id);
        return { ...col, tasks: updatedTasks };
      });
      return updatedCols;
    });

    await axios.put(
      `${BACKEND_URL}/tasks/delete_task/${task.id}`,
      {},
      { withCredentials: true },
    );
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
    getTasks,
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};

export { KanbanContext, KanbanContextProvider };
