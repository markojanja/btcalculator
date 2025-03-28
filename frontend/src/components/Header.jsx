import "./Header.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <NavLink to="/">BTCalculator</NavLink>
        </div>
        <ul>
          <li>
            <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="/">
              Pip Calculator
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="pnl">
              PNL Calculator
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="margin">
              Margin Calculator
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="swap">
              Swap Calculator
            </NavLink>
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
