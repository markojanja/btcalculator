import "./AddFeature.css";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Quill from "quill";
import ReactQuill from "react-quill";
import { IoMdArrowRoundBack } from "react-icons/io";

const EditGuide = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const getFeature = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/guides/${id}/edit`, {
          withCredentials: true,
        });
        const guide = response.data;
        console.log(guide);
        setTitle(guide.title);
        setDescription(guide.description);
        setPublished(guide.published);
      } catch (error) {
        console.log(error);
      }
    };

    getFeature();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      published,
    };
    try {
      await axios.put(`${BACKEND_URL}/guides/${id}/edit`, data, {
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
        <h3 style={{ textAlign: "left" }}>Edit feature</h3>
        <form action="put" onSubmit={handleSubmit}>
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
        <div className="modal-link">
          <Link
            style={{
              display: "flex",
              alignSelf: "end",
              marginRight: "16px",
              alignItems: "center",
            }}
            to={"/features"}
          >
            <IoMdArrowRoundBack /> Back to guides
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditGuide;
