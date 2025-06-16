import "./Users.css";
import axios from "axios";
import { useEffect, useState } from "react";
import UsersCard from "../components/UsersCard";

const Users = () => {
  const [users, setUsers] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getUsers = async () => {
      const res = await axios.get(`${BACKEND_URL}/users/all`, { withCredentials: true });
      console.log(res);
      setUsers(res.data);
    };

    getUsers();
  }, []);

  return (
    <div className="users-wrapper">
      <div className="users-header">
        <h3>Users</h3>
        <button className="btn-outline">New user</button>
      </div>
      <div className="users-list">
        {users.map((user) => (
          <UsersCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Users;
