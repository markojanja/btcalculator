import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import "./AdminTask.css";

const AdminTask = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const [task, setTask] = useState({});

  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/admindata/task/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);

        setTask(response.data.task);
      } catch (error) {
        console.log(error);
      }
    };

    getTask();
  }, []);

  const clean = DOMPurify.sanitize(task.description);

  return (
    <div className="m-wrapper">
      <div className="m-heading">
        <h2>Task</h2>
      </div>
      <div className="m-content">
        <div className="task-desc">
          <h2>{task.title}</h2>
          <div
            className="feature-desc"
            dangerouslySetInnerHTML={{ __html: clean }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTask;
