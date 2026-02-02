import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GuidesCard from "../components/GuidesCard";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";

const UserGuides = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/guides`, {
          withCredentials: true,
        });
        console.log(response);
        setGuides(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const { currentItems, pageCount, handlePageChange } = usePagination(
    guides,
    5,
  );

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">UserGuides</h2>
        <Link
          className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150"
          style={{ borderRadius: "8px" }}
          to="/guides/new"
        >
          New Guide
        </Link>
      </div>
      <div className="flex flex-col justify-start gap-2 py-6">
        {currentItems && currentItems?.length > 0 ? (
          currentItems.map((guide) => (
            <GuidesCard key={guide.id} guide={guide} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">No new guides yet</h2>
          </div>
        )}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default UserGuides;
