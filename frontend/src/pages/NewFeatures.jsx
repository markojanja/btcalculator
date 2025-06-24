import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./NewFeatures.css";
import axios from "axios";
import FeaturesCard from "../components/FeaturesCard";

const NewFeatures = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [features, setFeatures] = useState([]);
  useEffect(() => {
    const getPubFeatures = async () => {
      const pubFeatures = await axios.get(`${BACKEND_URL}/features/published`, {
        withCredentials: true,
      });
      setFeatures(pubFeatures.data);
    };
    getPubFeatures();
  }, []);

  return (
    <div className="features-wrapper">
      <div className="feature-header">
        <h3>Feature Announcements</h3>
        <Link className="btn-outline" style={{ borderRadius: "8px" }} to={"/features/new"}>
          New feature
        </Link>
      </div>
      <div className="feature-list">
        {features.length === 0 && (
          <div className="features-wrapper">
            <h2>No new features yet</h2>
          </div>
        )}

        {features.map((feature) => (
          <FeaturesCard key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export default NewFeatures;
