import { useEffect, useState } from "react";
import axios from "axios";

import Kanban from "../components/Kanban";
import AddTaskModal from "../components/AddTaskModal";

const Tasks = () => {
  const [taskModal, setTaskModal] = useState(false);
  const [tasks, setTasks] = useState();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tasks/my_tasks`, {
          withCredentials: true,
        });

        setTasks(res.data.message); // store tasks in state
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    getTasks();
  }, []);

  if (taskModal) {
    return <AddTaskModal setTaskModal={setTaskModal} />;
  }

  return (
    <div className="tasks-wrapper">
      <div className="tasks-header">
        <h3>My Tasks</h3>
      </div>
      <Kanban setTaskModal={setTaskModal} />
    </div>
  );
};

export default Tasks;
