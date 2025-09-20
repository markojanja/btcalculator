import "./Header.css";
import useAuth from "../hooks/useAuth";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useContext } from "react";

import { RiMenu4Line } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import ReactSwitch from "react-switch";
import { ThemeContext } from "../contexts/ThemeContext";
import { NavContext } from "../contexts/NavContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { toggleSidebar } = useContext(NavContext);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <NavLink to="/">
            <span className="is-active">CS</span>Board
          </NavLink>
        </div>
        <ul>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactSwitch
              height={16}
              width={32}
              boxShadow="none"
              activeBoxShadow="none"
              onColor="#c70036"
              handleDiameter={14}
              onChange={toggleTheme}
              checked={theme === "" ? false : true}
            />
          </li>
          <li className="profile-menu">
            <FaUserCircle size={20} />

            <div className="profile-submenu">
              <Link to={"/profile"} style={{ justifyContent: "flex-start" }}>
                <FaUser size={20} style={{ marginRight: "8px" }} />
                <span>
                  {user?.firstname} {user?.lastname}
                </span>
              </Link>
              <div style={{ display: "flex", alignItems: "start" }}>
                <a style={{ cursor: "pointer" }} onClick={handleLogOut}>
                  <FaPowerOff size={20} style={{ marginRight: "8px" }} />
                  <span>Log out</span>
                </a>
              </div>
            </div>
          </li>
          <li id="mobile-hidden" onClick={toggleSidebar}>
            <RiMenu4Line size={20} />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
