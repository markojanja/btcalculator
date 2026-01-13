import "./EditTask.css";
import axios from "axios";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { IoMdClose } from "react-icons/io";
import useKanban from "../hooks/useKanban";
import RichTextEditor from "./RichTextEditor";

const EditTask = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { toggleEditTaskModal, updateTask, activeTask, getTasks } = useKanban();

  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return res.data.secure_url;
  };

  const STATUS = ["TODO", "IN_PROGRESS", "CS_TICKET", "IT_TICKET"];
  const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

  const [title, setTitle] = useState(activeTask.title);
  const [content, setContent] = useState(activeTask.description);
  const [status, setStatus] = useState(activeTask.status);
  const [priority, setPriority] = useState(activeTask.priority);

  const handleSave = async () => {
    try {
      const updatedTask = {
        ...activeTask,
        title,
        description: content,
        status,
        priority,
      };
      updateTask(updatedTask);
      await axios.put(`${BACKEND_URL}/tasks/edit_task`, updatedTask, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await getTasks();
      toggleEditTaskModal();
    }
  };

  return (
    <div className="edit-task-modal">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0.5rem 3rem",
        }}
      >
        <IoMdClose size={24} onClick={() => toggleEditTaskModal()} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "700px",
          alignItems: "flex-start",
          justifyContent: "center",
          margin: "0 auto",
          gap: "1.5rem",
          height: "auto",
          backgroundColor: "var(--secondary-color)",
          padding: "1rem",
          borderRadius: "4px",
          boxShadow: "var(--box-shadow)",
        }}
      >
        <h3>Edit task</h3>
        <input
          type="text"
          placeholder="title"
          style={{
            backgroundColor: "var(--secondary-color)",
            boxShadow: "none",
          }}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title || ""}
        />
        <RichTextEditor
          value={content}
          onChange={setContent}
          uploadImage={uploadImage}
        />

        <div className="input-group flex-col">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              backgroundColor: "var(--secondary-color)",
              boxShadow: "none",
            }}
          >
            {STATUS.map((stat) => (
              <option key={stat} value={stat}>
                {stat}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group flex-col">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              backgroundColor: "var(--secondary-color)",
              boxShadow: "none",
            }}
          >
            {PRIORITY.map((prior) => (
              <option key={prior} value={prior}>
                {prior}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button onClick={() => handleSave()}>save</button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
