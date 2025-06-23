import "./FeatureDetails.css";
import axios from "axios";
import DOMPurify from "dompurify";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const FeatureDetails = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const [feature, setFeature] = useState({});
  useEffect(() => {
    const getFeature = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/features/${id}`, {
          withCredentials: true,
        });
        console.log(response);
        setFeature(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFeature();
  }, []);

  const clean = DOMPurify.sanitize(feature.description);

  return (
    <div className="feature-wrapper">
      <div className="feature-heading">
        <h2>{feature.title}</h2>
      </div>
      <div className="feature-desc" dangerouslySetInnerHTML={{ __html: clean }} />
      <Link style={{ alignSelf: "flex-end" }} to={"/features"}>
        Back to features
      </Link>
    </div>
  );
};

export default FeatureDetails;
