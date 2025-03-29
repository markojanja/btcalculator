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
