import "./AdminTasks.css";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const AdminTasks = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { type } = useParams();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const testData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/admindata/tasks/${type}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setTitle(response.data.page_title);
        setTasks(response.data.tasks);
      } catch (error) {
        console.log(error);
      }
    };
    testData();
  }, []);

  return (
    <div className="m-wrapper">
      <div className="m-heading">
        <h2>Tasks ({title})</h2>
      </div>
      <div className="m-content">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigne</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>
                  {task.user.firstname} {task.user.lastname}
                </td>
                <td>
                  <Link to={`/dashboard/task/${task.id}`}>view task</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTasks;
