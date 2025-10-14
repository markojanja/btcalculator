import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";
import { useState, useContext } from "react";
import { NavContext } from "../contexts/NavContext";
import { IoMdClose } from "react-icons/io";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();
  const { sidebarActive, closeSidebar } = useContext(NavContext);
  const isSubmenuActive = [
    "/calculators/pip",
    "/calculators/pnl",
    "/calculators/margin",
    "/calculators/swap",
  ].includes(location.pathname);

  const handleSubmenu = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={sidebarActive ? "sidebar show" : "sidebar"}
      onMouseLeave={closeSidebar}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IoMdClose size={20} onClick={closeSidebar} />
      </div>
      <ul className="sidebar-wrapper">
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <>
            <li id="mobile-hidden">
              <NavLink
                className={({ isActive }) => (isActive ? "is-active" : "")}
                to="/dashboard"
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "is-active" : "")}
                to="/dashboard/tasks/ALL"
              >
                Tasks
              </NavLink>
            </li>
          </>
        )}
        {user?.role === "SUPPORT" && (
          <li id="mobile-hidden">
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/tasks"
            >
              My Tasks
            </NavLink>
          </li>
        )}

        <li
          id="mobile-hidden"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <NavLink
            className={`submenu ${isSubmenuActive ? "is-active" : ""}`}
            to="/calculators/pip"
            style={{ textAlign: "left" }}
            onClick={handleSubmenu}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "6px" }}>Calculators</span>
              <IoChevronDown
                style={{
                  transition: "transform 0.3s ease",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </span>
          </NavLink>
          {expanded && (
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
                  Margin Calculator
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "is-active" : "")}
                  to="/calculators/swap"
                >
                  Swap Calculator
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {user?.centroid && (
          <li id="mobile-hidden">
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="converter"
            >
              Converter
            </NavLink>
          </li>
        )}

        <li id="mobile-hidden">
          <NavLink
            className={({ isActive }) => (isActive ? "is-active" : "")}
            to="/features"
          >
            Feature Announcements
          </NavLink>
        </li>
        <li id="mobile-hidden">
          <NavLink
            className={({ isActive }) => (isActive ? "is-active" : "")}
            to="/guides"
          >
            User Guides
          </NavLink>
        </li>
        {user?.role === "ADMIN" && (
          <li id="mobile-hidden">
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/users"
            >
              User Management
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
