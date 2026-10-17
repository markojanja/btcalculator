import { createContext, useState } from "react";

const KanbanContext = createContext(null);

// UI state of the task board: which panel is open and for which task.
// The tasks themselves come from the query cache (see api/tasks.js).
const KanbanContextProvider = ({ children }) => {
  const [panel, setPanel] = useState(null); // "add" | "edit" | "handover"
  const [activeTask, setActiveTask] = useState(null);

  const value = {
    panel,
    activeTask,
    openAdd: () => setPanel("add"),
    openEdit: (task) => {
      setActiveTask(task);
      setPanel("edit");
    },
    openHandover: () => setPanel("handover"),
    closePanel: () => {
      setPanel(null);
      setActiveTask(null);
    },
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};

export { KanbanContext, KanbanContextProvider };
