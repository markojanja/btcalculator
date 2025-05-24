import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
Quill.register("modules/imageResize", ImageResize);

const AddTaskModal = ({ setTaskModal }) => {
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
  const [content, setContent] = useState("");

  const handleTaskModal = () => {
    setTaskModal(false);
  };

  return (
    <div className="add-task-modal">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
          alignItems: "center",
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
        <h2>Add task</h2>
        <input
          type="text"
          placeholder="title"
          style={{ backgroundColor: "var(--secondary-color)" }}
        />
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
        />
        <div>
          <button onClick={handleTaskModal}>save</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
