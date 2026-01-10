import "./AddTaskModal.css";
import axios from "axios";
import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import { IoMdClose } from "react-icons/io";
import useKanban from "../hooks/useKanban";

Quill.register("modules/imageResize", ImageResize);

const AddTaskModal = () => {
  const quillRef = useRef(null);
  const { toggleAddTaskModal, addTask } = useKanban();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "code-block"],
      ["clean"], // remove formatting button
    ],
    imageResize: {
      parchment: Quill.import("parchment"), // required for Quill v2
      modules: ["Resize", "DisplaySize"],
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "code-block",
  ];
  const STATUS = ["TODO", "IN_PROGRESS", "CS_TICKET", "IT_TICKET"];
  const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(STATUS[0]);
  const [priority, setPriority] = useState(PRIORITY[0]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/tasks/add_task`,
        {
          title,
          description: content,
          status,
          priority,
        },
        { withCredentials: true }
      );

      addTask(response.data.task);
    } catch (error) {
      console.log(error);
    } finally {
      toggleAddTaskModal();
    }
  };

  return (
    <div className="add-task-modal">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0.5rem 3rem",
        }}
      >
        <IoMdClose size={24} onClick={() => toggleAddTaskModal()} />
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
        <h3>Add task</h3>
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
        />
        <ReactQuill
          forwardedRef={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
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
          <button onClick={handleSubmit}>save</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
