import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  return (
    <div className="m-wrapper">
      <div className="m-heading">
        <h3>UserGuides</h3>
        <Link className="btn-outline" style={{ borderRadius: "8px" }} to="#">
          New Guide
        </Link>
      </div>
      <div className="m-content">
        {guides && guides.length > 0 ? (
          guides.map((guide) => (
            <div key={guide.id} className="guide-item">
              <h4>{guide.title}</h4>
              <p>{guide.description}</p>
            </div>
          ))
        ) : (
          <h2>No guides yet</h2>
        )}
      </div>
    </div>
  );
};

export default UserGuides;
