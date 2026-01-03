import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./NewFeatures.css";
import axios from "axios";
import FeaturesCard from "../components/FeaturesCard";
import useAuth from "../hooks/useAuth";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";

const NewFeatures = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useAuth();
  const [features, setFeatures] = useState([]);
  useEffect(() => {
    const getPubFeatures = async () => {
      const pubFeatures = await axios.get(`${BACKEND_URL}/features/all`, {
        withCredentials: true,
      });
      setFeatures(pubFeatures.data);
    };
    getPubFeatures();
  }, []);

  const { currentItems, pageCount, handlePageChange } = usePagination(
    features,
    2
  );

  return (
    <div className="features-wrapper">
      <div className="feature-header">
        <h3>Feature Announcements</h3>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <Link
            className="btn-outline"
            style={{ borderRadius: "8px" }}
            to="/features/new"
          >
            New feature
          </Link>
        )}
      </div>
      <div className="feature-list">
        {currentItems.length === 0 && (
          <div className="features-wrapper">
            <h2>No new features yet</h2>
          </div>
        )}

        {currentItems.map((feature) => (
          <FeaturesCard key={feature.id} feature={feature} />
        ))}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default NewFeatures;
