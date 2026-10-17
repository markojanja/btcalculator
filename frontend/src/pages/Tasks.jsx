import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Kanban from "../components/Kanban";
import useKanban from "../hooks/useKanban";
import { KanbanContextProvider } from "../contexts/KanbanContext";

const TasksHeader = () => {
  const { openAdd, openHandover } = useKanban();

  return (
    <div className="flex justify-between items-start border-b border-b-muted py-3">
      <h2 className="text-2xl font-bold">My Tasks</h2>
      <div className="flex gap-2">
        <Button onClick={openAdd}>
          New <Plus className="h-3 w-3" />
        </Button>
        <Button onClick={openHandover}>Handover</Button>
      </div>
    </div>
  );
};

const Tasks = () => (
  <KanbanContextProvider>
    <div className="flex flex-1 flex-col w-full p-6">
      <TasksHeader />
      <Kanban />
    </div>
  </KanbanContextProvider>
);

export default Tasks;
