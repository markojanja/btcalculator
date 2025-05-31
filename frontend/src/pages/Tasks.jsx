import { FaPlus } from "react-icons/fa";
import Kanban from "../components/Kanban";
import useKanban from "../hooks/useKanban";

const Tasks = () => {
  const { toggleAddTaskModal } = useKanban();
  return (
    <div className="tasks-wrapper">
      <div className="tasks-header">
        <h3>My Tasks</h3>
        <button
          className="btn-outline"
          onClick={() => {
            toggleAddTaskModal();
          }}
        >
          New <FaPlus size={12} color="white!important" />
        </button>
      </div>
      <Kanban />
    </div>
  );
};

export default Tasks;
