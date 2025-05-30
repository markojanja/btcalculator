import "./Header.css";
import useAuth from "../hooks/useAuth";
import { useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";

import { RiMenu4Line } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";

import ReactSwitch from "react-switch";
import { ThemeContext } from "../contexts/ThemeContext";
import { NavContext } from "../contexts/NavContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { toggleSidebar } = useContext(NavContext);

  const { logout } = useAuth();
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
          <li style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
              <a href="#" style={{ justifyContent: "flex-start" }}>
                Marko Janjic
              </a>
              <div style={{ display: "flex", alignItems: "start" }}>
                <a style={{ cursor: "pointer" }} onClick={handleLogOut}>
                  <span>Log out</span>
                  <RiLogoutBoxRLine size={20} />
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
