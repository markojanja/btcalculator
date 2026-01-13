import "./AddFeature.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { IoMdArrowRoundBack } from "react-icons/io";
import RichTextEditor from "../components/RichTextEditor";
import useCloudinary from "../hooks/useCloudinary";

const AddGuide = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);

  const navigate = useNavigate();
  const { uploadImage } = useCloudinary();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
            <RichTextEditor
              value={description}
              onChange={setDescription}
              uploadImage={uploadImage}
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
            to={"/guides"}
          >
            <IoMdArrowRoundBack /> Back to guides
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddGuide;
