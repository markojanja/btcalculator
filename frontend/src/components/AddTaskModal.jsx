import "./AddTaskModal.css";
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

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const status = "TODO";

  const handleAddTask = () => {
    const newTask = {
      title,
      description: content,
      status,
    };
    addTask(newTask);
  };

  const handleSubmit = () => {
    handleAddTask();
    toggleAddTaskModal();
  };

  return (
    <div className="add-task-modal">
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.5rem 3rem" }}>
        <IoMdClose size={24} onClick={() => toggleAddTaskModal()} />
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
        <h3>Add task</h3>
        <input
          type="text"
          placeholder="title"
          style={{ backgroundColor: "var(--secondary-color)", boxShadow: "none" }}
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

        <div>
          <button onClick={handleSubmit}>save</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
