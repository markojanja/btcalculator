import { NavLink, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { NavContext } from "../contexts/NavContext";
import useAuth from "../hooks/useAuth";

import {
  ChevronDown,
  X,
  LayoutDashboard,
  ListChecks,
  Calculator,
  TrendingUp,
  DollarSign,
  Percent,
  Repeat,
  ArrowLeftRight,
  Megaphone,
  BookOpen,
  Users,
  UserRound,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

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

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full w-64 bg-background transition-transform duration-300 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.15)]
      ${sidebarActive ? "translate-x-0" : "-translate-x-full"}`}
      onMouseLeave={closeSidebar}
    >
      <div className="flex justify-end p-3">
        <Button variant="nostyle" size="icon" onClick={closeSidebar}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-60px)] px-3 text-left">
        <nav className="flex flex-col space-y-1">
          {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/dashboard/tasks/ALL"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                  }`
                }
              >
                <ListChecks className="h-4 w-4" />
                Tasks
              </NavLink>
            </>
          )}

          {user?.role === "SUPPORT" && (
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                }`
              }
            >
              <ListChecks className="h-4 w-4" />
              My Tasks
            </NavLink>
          )}

          <Collapsible open={expanded} onOpenChange={setExpanded}>
            <CollapsibleTrigger
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-primary/80 ${
                isSubmenuActive ? "bg-primary font-medium" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculators
              </div>

              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent className="ml-6 flex flex-col space-y-1 mt-1">
              <NavLink
                to="/calculators/pip"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                  }`
                }
              >
                <TrendingUp className="h-4 w-4" />
                Pip Value
              </NavLink>

              <NavLink
                to="/calculators/pnl"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                  }`
                }
              >
                <DollarSign className="h-4 w-4" />
                Profit & Loss
              </NavLink>

              <NavLink
                to="/calculators/margin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                  }`
                }
              >
                <Percent className="h-4 w-4" />
                Margin Calculator
              </NavLink>

              <NavLink
                to="/calculators/swap"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                  }`
                }
              >
                <Repeat className="h-4 w-4" />
                Swap Calculator
              </NavLink>
            </CollapsibleContent>
          </Collapsible>

          {user?.centroid && (
            <NavLink
              to="/converter"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                }`
              }
            >
              <ArrowLeftRight className="h-4 w-4" />
              Converter
            </NavLink>
          )}

          <NavLink
            to="/features"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
              }`
            }
          >
            <Megaphone className="h-4 w-4" />
            Features
          </NavLink>

          <NavLink
            to="/guides"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
              }`
            }
          >
            <BookOpen className="h-4 w-4" />
            Guides
          </NavLink>

          {user?.role === "ADMIN" && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
                }`
              }
            >
              <Users className="h-4 w-4" />
              User Management
            </NavLink>
          )}

          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
              }`
            }
          >
            <UserRound className="h-4 w-4" />
            ClientList
          </NavLink>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
