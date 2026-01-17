import "./AddFeature.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import CustomDatePicker from "../components/CustomDatePicker";
import { IoMdArrowRoundBack } from "react-icons/io";
import useCloudinary from "../hooks/useCloudinary";
import RichTextEditor from "../components/RichTextEditor";

const EditFeature = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [released, setReleased] = useState(false);
  const [published, setPublished] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");
  const { uploadImage } = useCloudinary();

  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getFeature = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/features/${id}/edit`, {
          withCredentials: true,
        });
        const feature = response.data;
        setTitle(feature.title);
        setDescription(feature.description);
        setReleased(feature.released);
        setReleaseDate(new Date(feature.releaseDate));
        setPublished(feature.published);
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
      releaseDate: releaseDate
        ? new Date(releaseDate).toISOString().split("T")[0]
        : null,
      released,
      published,
    };
    try {
      await axios.put(`${BACKEND_URL}/features/${id}/edit`, data, {
        withCredentials: true,
      });
      navigate("/features");
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
            <RichTextEditor
              value={description}
              onChange={setDescription}
              uploadImage={uploadImage}
            />
          </div>
          <div className="form-group">
            <CustomDatePicker
              setter={setReleaseDate}
              placeholder={"select release date"}
              initialValue={releaseDate}
            />
          </div>

          <div className="checkbox-group">
            <label htmlFor="checkbox">Released</label>
            <input
              id="checkbox"
              type="checkbox"
              checked={released}
              className="w-auto"
              onChange={() => {
                setReleased(!released);
              }}
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
            <IoMdArrowRoundBack /> Back to features
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditFeature;
