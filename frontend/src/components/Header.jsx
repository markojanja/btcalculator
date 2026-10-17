import "./Header.css";
import useAuth from "../hooks/useAuth";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, LogOutIcon, Menu, UserIcon } from "lucide-react";

import { NavContext } from "../contexts/NavContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
const Header = () => {
  const { toggleSidebar } = useContext(NavContext);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <header className="flex w-full px-6 min-h-20">
      <nav className="flex items-center justify-between w-full">
        <div className="logo">
          <NavLink to="/">
            <span className="text-primary">CS</span>Board
          </NavLink>
        </div>
        <ul className="flex gap-3">
          <li className="flex items-center justify-center">
            <ThemeSwitcher />
          </li>

          <DropdownMenu className="bg-background border-none">
            <DropdownMenuTrigger asChild>
              <Button variant="nostyle">
                <CircleUserRound />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none shadow-md">
              <DropdownMenuItem asChild>
                <Link to="profile" className="flex items-center gap-2">
                  <UserIcon />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Link
                  onClick={handleLogOut}
                  to={"#"}
                  className="flex items-center gap-2"
                >
                  <LogOutIcon className="text-destructive" />
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <li
            id="mobile-hidden"
            className="flex items-center justify-center"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
