import { ClipboardList, KanbanSquare, Plus } from "lucide-react";
import Kanban from "../components/Kanban";
import useKanban from "../hooks/useKanban";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../components/PageUI";

const Tasks = () => {
  const { toggleAddTaskModal, toggleHandoverModal } = useKanban();
  return (
    <div className="flex w-full flex-1 flex-col gap-6 p-4 text-left sm:p-6">
      <PageHeader
        icon={KanbanSquare}
        title="My tasks"
        description="Drag a card to another column to change its status."
        actions={
          <>
            <Button variant="outline" onClick={toggleHandoverModal}>
              <ClipboardList />
              Handover
            </Button>
            <Button onClick={toggleAddTaskModal}>
              <Plus />
              New task
            </Button>
          </>
        }
      />
      <Kanban />
    </div>
  );
};

export default Tasks;
