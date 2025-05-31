import { useContext } from "react";
import { KanbanContext } from "../contexts/KanbanContext";

const useKanban = () => {
  const context = useContext(KanbanContext);

  if (context === undefined) {
    throw new Error("useKanban must be used within an kanban provider");
  }

  return context;
};

export default useKanban;
