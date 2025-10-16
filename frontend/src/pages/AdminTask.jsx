import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import "./AdminTask.css";

const AdminTask = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState({});
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    status: "",
    priority: "",
    userId: "",
  });

  const STATUS = ["TODO", "IN_PROGRESS", "CS_TICKET", "IT_TICKET"];
  const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

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
        setUsers(response.data.users);
        setTask(response.data.task);
      } catch (error) {
        console.log(error);
      }
    };

    getTask();
  }, []);

  useEffect(() => {
    if (task?.id) {
      setFormData({
        id: task.id,
        status: task.status || "",
        priority: task.priority || "",
        userId: task.userId || "",
      });
    }
  }, [task]);

  const clean = DOMPurify.sanitize(task.description);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`${BACKEND_URL}/tasks/edit_task`, formData, {
        withCredentials: true,
      });
      if (res) {
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="m-wrapper">
      <div className="m-heading">
        <h2>Task</h2>
      </div>
      <div className="m-content">
        <div className="task-desc-admin">
          <h2>{task.title}</h2>
          <div
            className="task-card-admin"
            dangerouslySetInnerHTML={{ __html: clean }}
          />
          <div className="edit-form">
            <div>
              <select
                name="userId"
                id="user"
                value={formData.userId}
                onChange={handleChange}
              >
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstname}
                  </option>
                ))}
              </select>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS.map((stat, i) => (
                  <option key={i} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
              <select
                name="priority"
                id="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITY.map((priority, i) => (
                  <option key={i} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handleSubmit}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTask;
