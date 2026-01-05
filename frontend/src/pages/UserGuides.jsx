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
    5
  );

  return (
    <div className="m-wrapper">
      <div className="m-heading">
        <h3>UserGuides</h3>
        <Link
          className="btn-outline"
          style={{ borderRadius: "8px" }}
          to="/guides/new"
        >
          New Guide
        </Link>
      </div>
      <div className="m-list">
        {currentItems && currentItems?.length > 0 ? (
          currentItems.map((guide) => (
            <GuidesCard key={guide.id} guide={guide} />
          ))
        ) : (
          <h2>No guides yet</h2>
        )}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default UserGuides;
