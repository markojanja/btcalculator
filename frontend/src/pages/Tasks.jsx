import { FaPlus } from "react-icons/fa";
import Kanban from "../components/Kanban";
import useKanban from "../hooks/useKanban";
import { Button } from "@/components/ui/button";

const Tasks = () => {
  const { toggleAddTaskModal, toggleHandoverModal } = useKanban();
  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">MyTasks</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              toggleAddTaskModal();
            }}
          >
            New <FaPlus size={12} />
          </Button>
          <Button onClick={toggleHandoverModal}>Handover</Button>
        </div>
      </div>
      <Kanban />
    </div>
  );
};

export default Tasks;
