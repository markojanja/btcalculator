import { useEffect, useState } from "react";
import "./AddUser.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

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
  const [errorPopup, setErrorPopup] = useState("");

  const matchPwd =
    password === repeatPassword && repeatPassword.length > 3 ? true : false;

  useEffect(() => {
    if (firstname || lastname) {
      setUsername(`${firstname.toLowerCase()}.${lastname.toLowerCase()}`);
    } else {
      setUsername("");
    }
  }, [firstname, lastname]);

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
      acitve: activeUser,
      centroid,
    };

    try {
      const res = await axios.post(
        `${BACKEND_URL}/users/new`,
        { ...newUser },
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
        <h3 style={{ textAlign: "left" }}>New User user</h3>
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
            <label>password</label>
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              style={{
                borderColor: matchPwd
                  ? "limegreen"
                  : repeatPassword.length > 4
                  ? "red"
                  : "",
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
              style={{
                borderColor: matchPwd
                  ? "limegreen"
                  : repeatPassword.length > 4
                  ? "red"
                  : "",
              }}
            />
            {!matchPwd && repeatPassword.length > 4 && (
              <p style={{ color: "oklch(50.5% 0.213 27.518)" }}>
                passwords do not match
              </p>
            )}
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
          <button
            disabled={!matchPwd}
            type="submit"
            style={{ opacity: !matchPwd ? "0.7" : "1" }}
          >
            Save
          </button>
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

export default AddUser;
