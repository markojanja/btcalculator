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

  const { currentItems, pageCount, handlePageChange } = usePagination(users, 4);

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Users</h2>
        <Link
          className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150"
          style={{ borderRadius: "8px" }}
          to={"/users/add"}
        >
          New user
        </Link>
      </div>
      <div className="flex flex-col flex-1 justify-start gap-2 py-6">
        {currentItems.map((user) => (
          <UsersCard key={user.id} user={user} />
        ))}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default Users;
