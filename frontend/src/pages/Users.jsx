import axios from "axios";
import { useEffect, useState } from "react";
import UsersCard from "../components/UsersCard";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import SearchInput from "../components/SearchInput";
import useSearch from "../hooks/useSearch";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const { query, setQuery, filtered, handleSearch } = useSearch(users, [
    "firstname",
    "lastname",
    "username",
  ]);

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

  const { currentItems, pageCount, handlePageChange } = usePagination(
    filtered,
    4,
  );

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-1 lg:items-center border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Users</h2>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
        />
        <Link
          className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150"
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
