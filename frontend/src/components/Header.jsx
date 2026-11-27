import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOutIcon, Menu, UserIcon } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { NavContext } from "../contexts/NavContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initials = (user) =>
  [user?.firstname, user?.lastname]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("") || "?";

const Header = () => {
  const { toggleSidebar } = useContext(NavContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <NavLink to="/" className="text-lg font-black tracking-tight">
        <span className="text-primary">CS</span>Board
      </NavLink>

      <div className="flex items-center gap-1">
        <ThemeSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2 rounded-full pl-1 pr-3"
              aria-label="Account menu"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials(user)}
              </span>
              <span className="hidden text-sm font-medium sm:inline">
                {user?.firstname}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-left font-normal">
              <p className="truncate text-sm font-medium">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <UserIcon />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={handleLogOut}
              className="cursor-pointer"
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu />
        </Button>
      </div>
    </header>
  );
};

export default Header;
