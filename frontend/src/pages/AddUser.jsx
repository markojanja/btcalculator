import { useState } from "react";
import "./AddUser.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [activeUser, setActiveUser] = useState(true);
  const [centroid, setCentroid] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      firstname,
      lastname,
      username,
      email,
      password,
      repeatPassword,
      role,
      activeUser,
      centroid,
    };

    const res = await axios.post(
      `${BACKEND_URL}/users/new`,
      { ...newUser },
      { withCredentials: true }
    );
    console.log(res.data);
    navigate("/users");
  };

  return (
    <div className="modal-wrapper">
      <div className="form-container">
        <form action="post" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>firstname</label>
            <input
              type="text"
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>lastname</label>
            <input
              type="text"
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>username</label>
            <input
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>email</label>
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>password</label>
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>repeat password</label>
            <input
              type="password"
              onChange={(e) => {
                setRepeatPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="SUPPORT">Support</option>
            </select>
          </div>
          <div className="checkbox-group">
            <label htmlFor="checkbox">Active</label>
            <input
              id="checkbox"
              type="checkbox"
              checked={activeUser}
              className="w-auto"
              onChange={() => {
                setActiveUser(!activeUser);
              }}
            />
          </div>
          <div className="checkbox-group">
            <label htmlFor="checkbox">Centroid</label>
            <input
              id="checkbox"
              type="checkbox"
              checked={centroid}
              className="w-auto"
              onChange={() => {
                setCentroid(!centroid);
              }}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
