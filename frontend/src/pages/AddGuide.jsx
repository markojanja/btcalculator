import "./AddFeature.css";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Quill from "quill";
import ReactQuill from "react-quill";
import { IoMdArrowRoundBack } from "react-icons/io";

const AddGuide = () => {
  const quillRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newGuide = {
        title,
        description,
        published,
      };
      await axios.post(`${BACKEND_URL}/guides/new`, newGuide, {
        withCredentials: true,
      });
      navigate("/guides");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal-wrapper">
      <div className="form-container">
        <h3 style={{ textAlign: "left" }}>New guide</h3>
        <form action="post" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <ReactQuill
              forwardedRef={quillRef}
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
            />
          </div>
          <div className="checkbox-group">
            <label htmlFor="checkbox">Published</label>
            <input
              id="checkbox"
              type="checkbox"
              checked={published}
              className="w-auto"
              onChange={() => {
                setPublished(!published);
              }}
            />
          </div>
          <button style={{ alignSelf: "self-start" }}>Save</button>
        </form>
      </div>
      <div className="modal-link">
        <Link
          style={{
            display: "flex",
            alignSelf: "end",
            marginRight: "16px",
            alignItems: "center",
          }}
          to={"/guides"}
        >
          <IoMdArrowRoundBack /> Back to guides
        </Link>
      </div>
    </div>
  );
};

export default AddGuide;
