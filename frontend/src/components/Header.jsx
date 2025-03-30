import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import "./Header.css";
import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const isSubmenuActive = ["/", "/pnl", "/margin", "/swap"].includes(location.pathname);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <NavLink to="/">BTCalculator</NavLink>
        </div>
        <ul>
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
