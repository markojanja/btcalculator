import "./GuideDetails.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import useAuth from "../hooks/useAuth";

const GuideDetails = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [guide, setGuide] = useState({});
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const getGuide = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/guides/${id}`, {
          withCredentials: true,
        });
        setGuide(res.data);
        console.log(res.data.userId, user.id);
      } catch (error) {
        console.log(error);
      }
    };
    getGuide();
  }, []);

  const clean = DOMPurify.sanitize(guide.description);

  return (
    <div className="guide-wrapper">
      <div className="guide-heading">
        <h2>{guide.title}</h2>
        {user?.id === guide.userId && (
          <Link to={`/guides/${guide.id}/edit`} className="btn btn-outline">
            Edit
          </Link>
        )}
      </div>
      <div className="guide-desc" dangerouslySetInnerHTML={{ __html: clean }} />
      <div style={{ textAlign: "left" }}>
        <p>published: {guide.published ? "✅" : "❌"}</p>
        <p>author:{guide.user?.username}</p>
        <p>created: {new Date(guide.createdAt).toLocaleDateString()}</p>
      </div>
      <Link style={{ alignSelf: "flex-end" }} to={"/guides"}>
        Back to guides
      </Link>
    </div>
  );
};

export default GuideDetails;
