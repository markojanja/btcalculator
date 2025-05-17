import "./MobileNav.css";
import { NavLink } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useContext } from "react";
import { NavContext } from "../contexts/NavContext";

const MobileNav = () => {
  const { sidebarActive, toggleSidebar } = useContext(NavContext);

  return (
    <aside className={sidebarActive ? "sidebar show" : "sidebar"}>
      <IoMdClose size={24} style={{ alignSelf: "flex-end" }} onClick={toggleSidebar} />
      <div className="sidebar-container">
        <ul>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/"
              onClick={toggleSidebar}
            >
              Pip Value
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/pnl"
              onClick={toggleSidebar}
            >
              Profit & Loss
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/margin"
              onClick={toggleSidebar}
            >
              Margin Value
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/swap"
              onClick={toggleSidebar}
            >
              Swap Values
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : "")}
              to="/converter"
              onClick={toggleSidebar}
            >
              Converter
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default MobileNav;
