import { useEffect, useState } from "react";
import "./AddUser.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const EditUser = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [activeUser, setActiveUser] = useState(false);
  const [centroid, setCentroid] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users/${id}/edit`, {
          withCredentials: true,
        });

        const user = response.data;
        console.log(user);
        setFirstname(user.firstname);
        setLastname(user.lastname);
        setUsername(user.username);
        setEmail(user.email);
        setRole(user.role);
        setActiveUser(user.active);
        setCentroid(user.centroid);
      } catch (error) {
        setErrorPopup(error);
      }
    };
    getUser();
  }, []);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedUser = {
      firstname,
      lastname,
      username,
      email,
      role,
      active: activeUser,
      centroid,
    };

    try {
      const res = await axios.put(
        `${BACKEND_URL}/users/${id}/edit`,
        { ...editedUser },
        { withCredentials: true }
      );
      console.log(res.data);
      setErrorPopup("");
      navigate("/users");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        console.log(err.response.data.message);
        setErrorPopup(err.response.data.message);
      } else {
        console.log("Something went wrong. Please try again.");
        setErrorPopup("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="modal-wrapper">
      <div className="form-container">
        {errorPopup && (
          <div className="error-popup">
            <p>{errorPopup}</p>
          </div>
        )}
        <h3 style={{ textAlign: "left" }}>Edit User</h3>
        <form action="post" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>firstname</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>lastname</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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
            <label htmlFor="checkbox2">Centroid</label>
            <input
              id="checkbox2"
              type="checkbox"
              checked={centroid}
              className="w-auto"
              onChange={() => {
                setCentroid(!centroid);
              }}
            />
          </div>
          <button type="submit">Edit</button>
        </form>
        <div className="modal-link">
          <Link
            style={{
              display: "flex",
              alignSelf: "end",
              marginRight: "16px",
              alignItems: "center",
            }}
            to={"/users"}
          >
            <IoMdArrowRoundBack /> Back to users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
