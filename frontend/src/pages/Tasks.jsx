import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Kanban from "../components/Kanban";

const Tasks = () => {
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  return (
    <div className="tasks-wrapper">
      <div className="tasks-header">
        <h3>My Tasks</h3>
        <button
          className="btn-outline"
          onClick={() => {
            setTaskModal(!taskModal);
          }}
        >
          New <FaPlus size={12} color="white!important" />
        </button>
      </div>
      <Kanban
        taskModal={taskModal}
        setTaskModal={setTaskModal}
        editModal={editModal}
        setEditModal={setEditModal}
      />
    </div>
  );
};

export default Tasks;
