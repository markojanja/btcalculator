import "./Users.css";
import axios from "axios";
import { useEffect, useState } from "react";
import UsersCard from "../components/UsersCard";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get(`${BACKEND_URL}/users/all`, {
        withCredentials: true,
      });
      console.log(res);
      setUsers(res.data);
    };

    getUsers();
  }, []);

  const { currentItems, pageCount, handlePageChange } = usePagination(users, 1);

  return (
    <div className="users-wrapper">
      <div className="users-header">
        <h3>Users</h3>
        <Link
          className="btn-outline"
          style={{ borderRadius: "8px" }}
          to={"/users/add"}
        >
          New user
        </Link>
      </div>
      <div className="users-list">
        {currentItems.map((user) => (
          <UsersCard key={user.id} user={user} />
        ))}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default Users;
