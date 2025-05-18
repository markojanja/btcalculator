import "./Header.css";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { IoChevronDown } from "react-icons/io5";
import { RiMenu4Line } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";
import ReactSwitch from "react-switch";
import { ThemeContext } from "../contexts/ThemeContext";
import { NavContext } from "../contexts/NavContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { toggleSidebar } = useContext(NavContext);
  const location = useLocation();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const isSubmenuActive = [
    "/calculators/pip",
    "/calculators/pnl",
    "/calculators/margin",
    "/calculators/swap",
  ].includes(location.pathname);

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
            <span className="is-active">BT</span>Calculator
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
          <li id="mobile-hidden">
            <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="/">
              MyTasks
            </NavLink>
          </li>
          <li id="mobile-nav" onClick={toggleSidebar}>
            <RiMenu4Line size={24} />
          </li>

          <li
            id="mobile-hidden"
            onMouseEnter={() => setSubmenuOpen(true)}
            onMouseLeave={() => setSubmenuOpen(false)}
          >
            <NavLink
              className={`submenu ${isSubmenuActive ? "is-active" : ""}`}
              to="/calculators/pip"
            >
              Calculators <IoChevronDown style={{ marginTop: "1px" }} />
            </NavLink>
            {submenuOpen && (
              <ul className="dropdown">
                <li>
                  <NavLink
                    className={({ isActive }) => (isActive ? "is-active" : "")}
                    to="/calculators/pip"
                  >
                    Pip Value
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) => (isActive ? "is-active" : "")}
                    to="/calculators/pnl"
                  >
                    Profit & Loss
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) => (isActive ? "is-active" : "")}
                    to="/calculators/margin"
                  >
                    Margin Value
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) => (isActive ? "is-active" : "")}
                    to="/calculators/swap"
                  >
                    Swap Values
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li id="mobile-hidden">
            <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="converter">
              Converter
            </NavLink>
          </li>

          <li id="mobile-hidden" onClick={toggleSidebar}>
            <a style={{ cursor: "pointer" }} onClick={handleLogOut}>
              Log Out
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
