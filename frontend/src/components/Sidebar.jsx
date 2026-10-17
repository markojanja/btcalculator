import { NavLink, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
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
import { NavContext } from "../contexts/NavContext";
import useAuth from "../hooks/useAuth";
import { isStaff } from "../constants/domain";

// `show` decides who sees a link; links without it are shown to everyone.
const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: isStaff, end: true },
  { to: "/dashboard/tasks/ALL", label: "Tasks", icon: ListChecks, show: isStaff },
  { to: "/tasks", label: "My Tasks", icon: ListChecks, show: (user) => user?.role === "SUPPORT" },
  {
    label: "Calculators",
    icon: Calculator,
    children: [
      { to: "/calculators/pip", label: "Pip Value", icon: TrendingUp },
      { to: "/calculators/pnl", label: "Profit & Loss", icon: DollarSign },
      { to: "/calculators/margin", label: "Margin Calculator", icon: Percent },
      { to: "/calculators/swap", label: "Swap Calculator", icon: Repeat },
    ],
  },
  { to: "/converter", label: "Converter", icon: ArrowLeftRight, show: (user) => user?.centroid },
  { to: "/features", label: "Features", icon: Megaphone },
  { to: "/guides", label: "Guides", icon: BookOpen },
  { to: "/users", label: "User Management", icon: Users, show: isStaff },
  { to: "/clients", label: "Clients", icon: UserRound },
];

const linkClass = (isActive) =>
  `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
    isActive ? "bg-primary font-medium" : "hover:bg-primary/80"
  }`;

const NavItem = ({ item }) => (
  <NavLink
    to={item.to}
    end={item.end}
    className={({ isActive }) => linkClass(isActive)}
  >
    <item.icon className="h-4 w-4" />
    {item.label}
  </NavLink>
);

const NavGroup = ({ item }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const isActive = item.children.some((child) => child.to === location.pathname);

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-primary/80 ${
          isActive ? "bg-primary font-medium" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <item.icon className="h-4 w-4" />
          {item.label}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-6 flex flex-col space-y-1 mt-1">
        {item.children.map((child) => (
          <NavItem key={child.to} item={child} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarActive, closeSidebar } = useContext(NavContext);
  const items = NAV_ITEMS.filter((item) => !item.show || item.show(user));

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
          {items.map((item) =>
            item.children ? (
              <NavGroup key={item.label} item={item} />
            ) : (
              <NavItem key={item.to} item={item} />
            ),
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
