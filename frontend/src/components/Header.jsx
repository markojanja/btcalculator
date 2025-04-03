import "./Header.css";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import ReactSwitch from "react-switch";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const isSubmenuActive = ["/", "/pnl", "/margin", "/swap"].includes(location.pathname);

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
          <li onMouseEnter={() => setSubmenuOpen(true)} onMouseLeave={() => setSubmenuOpen(false)}>
            <NavLink className={`submenu ${isSubmenuActive ? "is-active" : ""}`} to="/">
              Calculators <IoChevronDown style={{ marginTop: "1px" }} />
            </NavLink>
            {submenuOpen && (
              <ul className="dropdown">
                <li>
                  <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="/">
                    Pip Value
                  </NavLink>
                </li>
                <li>
                  <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="pnl">
                    Profit & Loss
                  </NavLink>
                </li>
                <li>
                  <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="margin">
                    Margin Value
                  </NavLink>
                </li>
                <li>
                  <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="swap">
                    Swap Values
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="converter">
              Converter
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
