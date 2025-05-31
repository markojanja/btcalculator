import "./EditTask.css";
import axios from "axios";
import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import { IoMdClose } from "react-icons/io";
import useKanban from "../hooks/useKanban";

Quill.register("modules/imageResize", ImageResize);

const EditTask = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { toggleEditTaskModal, updateTask, activeTask } = useKanban();
  const quillRef = useRef(null);

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

  const [title, setTitle] = useState(activeTask.title);
  const [content, setContent] = useState(activeTask.description);
  // const [status, setStatus] = useState(activeTask.status);
  // const [position, setPosition] = useState(activeTask.position);
  // const [id, setID] = useState(activeTask.id);

  const handleSave = async () => {
    try {
      const updatedTask = { ...activeTask, title, description: content };
      console.log(activeTask);
      await axios.put(`${BACKEND_URL}/tasks/edit_task`, updatedTask, { withCredentials: true });
      updateTask(updatedTask);
    } catch (error) {
      console.log(error);
    } finally {
      toggleEditTaskModal();
    }
  };

  return (
    <div className="edit-task-modal">
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.5rem 3rem" }}>
        <IoMdClose size={24} onClick={() => toggleEditTaskModal()} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
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
          style={{ backgroundColor: "var(--secondary-color)", boxShadow: "none" }}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title || ""}
        />
        <ReactQuill
          forwardedRef={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
        />

        <div>
          <button onClick={() => handleSave()}>save</button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
