import "./Header.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <NavLink to="/">BTCalaculator</NavLink>
        </div>
        <ul>
          <li>
            <NavLink to="/">Pip Calculator</NavLink>
          </li>
          <li>
            <NavLink to="pnl">PNL Calculator</NavLink>
          </li>
          <li>
            <NavLink to="margin">Margin Calculator</NavLink>
          </li>
          <li>
            <NavLink to="swap">Swap Calculator</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
