import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";
import { useState, useContext } from "react";
import { NavContext } from "../contexts/NavContext";
import { IoMdClose } from "react-icons/io";

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const { sidebarActive, toggleSidebar } = useContext(NavContext);
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
    <div className={sidebarActive ? "sidebar show" : "sidebar"}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IoMdClose size={20} onClick={toggleSidebar} />
      </div>
      <ul className="sidebar-wrapper">
        <li id="mobile-hidden">
          <NavLink
            className={({ isActive }) => (isActive ? "is-active" : "")}
            to="/"
            onClick={toggleSidebar}
          >
            MyTasks
          </NavLink>
        </li>

        <li
          id="mobile-hidden"
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
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
                  onClick={toggleSidebar}
                >
                  Pip Value
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "is-active" : "")}
                  to="/calculators/pnl"
                  onClick={toggleSidebar}
                >
                  Profit & Loss
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "is-active" : "")}
                  to="/calculators/margin"
                  onClick={toggleSidebar}
                >
                  Margin Value
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "is-active" : "")}
                  to="/calculators/swap"
                  onClick={toggleSidebar}
                >
                  Swap Values
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li id="mobile-hidden">
          <NavLink
            className={({ isActive }) => (isActive ? "is-active" : "")}
            to="converter"
            onClick={toggleSidebar}
          >
            Converter
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
