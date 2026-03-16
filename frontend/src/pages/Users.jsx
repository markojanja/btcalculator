import "./Users.css";
import axios from "axios";
import { useEffect, useState } from "react";
import UsersCard from "../components/UsersCard";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { Field } from "@/components/ui/field";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get(`${BACKEND_URL}/users/all`, {
        withCredentials: true,
      });
      console.log(res);
      setUsers(res.data);
      setFiltered(res.data);
    };

    getUsers();
  }, []);

  const handleSearch = () => {
    setFiltered(
      users.filter(
        (user) =>
          user.firstname.toLowerCase().includes(query.toLowerCase()) ||
          user.lastname.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase()),
      ),
    );
    setQuery("");
  };

  const { currentItems, pageCount, handlePageChange } = usePagination(
    filtered,
    4,
  );

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Users</h2>
        <Field className="max-w-2xs">
          <ButtonGroup>
            <Input
              id="input-button-group"
              placeholder="Type to search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <Button variant="outline" onClick={handleSearch}>
              <Search />
            </Button>
          </ButtonGroup>
        </Field>
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
