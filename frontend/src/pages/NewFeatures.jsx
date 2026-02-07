import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    5,
  );

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Feature Announcements</h2>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <Link
            className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150"
            style={{ borderRadius: "8px" }}
            to="/features/new"
          >
            New feature
          </Link>
        )}
      </div>
      <div className="flex flex-col justify-start gap-2 py-6">
        {currentItems?.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">No new features yet</h2>
          </div>
        )}

        {currentItems?.map((feature) => (
          <FeaturesCard key={feature.id} feature={feature} />
        ))}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default NewFeatures;
