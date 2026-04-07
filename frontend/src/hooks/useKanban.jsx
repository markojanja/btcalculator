import { useContext } from "react";
import { KanbanContext } from "../contexts/KanbanContext";

const useKanban = () => {
  const context = useContext(KanbanContext);

  if (context === null) {
    // ✅ check for null, not undefined
    throw new Error("useKanban must be used within a KanbanProvider");
  }

  return context;
};

export default useKanban;
