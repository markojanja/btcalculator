import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  Calculator,
  ChevronDown,
  DollarSign,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Percent,
  Repeat,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { NavContext } from "../contexts/NavContext";
import useAuth from "../hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const STAFF = ["ADMIN", "MANAGER"];

// `show(user)` decides who sees a link; omitted = everyone.
const MAIN_LINKS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
    show: (u) => STAFF.includes(u?.role),
  },
  {
    to: "/dashboard/tasks/ALL",
    label: "Tasks",
    icon: ListChecks,
    show: (u) => STAFF.includes(u?.role),
  },
  {
    to: "/tasks",
    label: "My tasks",
    icon: ListChecks,
    show: (u) => u?.role === "SUPPORT",
  },
];

const CALCULATOR_LINKS = [
  { to: "/calculators/pip", label: "Pip value", icon: TrendingUp },
  { to: "/calculators/pnl", label: "Profit & loss", icon: DollarSign },
  { to: "/calculators/margin", label: "Margin", icon: Percent },
  { to: "/calculators/swap", label: "Swap", icon: Repeat },
];

const TOOL_LINKS = [
  {
    to: "/converter",
    label: "Converter",
    icon: ArrowLeftRight,
    show: (u) => u?.centroid,
  },
];

const WORKSPACE_LINKS = [
  { to: "/features", label: "Features", icon: Megaphone },
  { to: "/guides", label: "Guides", icon: BookOpen },
  { to: "/clients", label: "Clients", icon: UserRound },
  {
    to: "/users",
    label: "User management",
    icon: Users,
    show: (u) => STAFF.includes(u?.role),
  },
];

const linkClass = ({ isActive }) =>
  cn(
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
    isActive
      ? "bg-primary/10 font-medium text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );

const NavItem = ({ to, label, icon: Icon, end }) => (
  <NavLink to={to} end={end} className={linkClass}>
    <Icon className="size-4 shrink-0" />
    {label}
  </NavLink>
);

const Section = ({ title, children }) => (
  <div className="space-y-1">
    {title && (
      <p className="px-3 pb-1 pt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
        {title}
      </p>
    )}
    {children}
  </div>
);

const initials = (user) =>
  [user?.firstname, user?.lastname]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("") || "?";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { sidebarActive, closeSidebar } = useContext(NavContext);

  const onCalculator = location.pathname.startsWith("/calculators");
  const [calculatorsOpen, setCalculatorsOpen] = useState(onCalculator);

  const visible = (links) => links.filter((l) => !l.show || l.show(user));
  const tools = visible(TOOL_LINKS);

  // Close the drawer after navigating, and on Escape
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    if (onCalculator) setCalculatorsOpen(true);
  }, [onCalculator]);

  useEffect(() => {
    if (!sidebarActive) return;
    const onKey = (e) => e.key === "Escape" && closeSidebar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarActive]);

  return (
    <>
      {/* Backdrop while the drawer is open */}
      <div
        aria-hidden
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity",
          sidebarActive ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background lg:w-80 text-left transition-transform duration-300",
          sidebarActive ? "translate-x-0 shadow-xl" : "-translate-x-full",
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <NavLink to="/" className="text-xl font-black tracking-tight">
            <span className="text-primary">CS</span>Board
          </NavLink>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X />
          </Button>
        </div>

        {/* Links */}
        <ScrollArea className="min-h-0 flex-1 px-3 py-3">
          <nav className="flex flex-col">
            <Section>
              {visible(MAIN_LINKS).map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            </Section>

            <Section title="Tools">
              <Collapsible
                open={calculatorsOpen}
                onOpenChange={setCalculatorsOpen}
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    onCalculator
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Calculator className="size-4" />
                    Calculators
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      calculatorsOpen && "rotate-180",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 ml-5 space-y-1 pl-2">
                  {CALCULATOR_LINKS.map((link) => (
                    <NavItem key={link.to} {...link} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
              {tools.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            </Section>

            <Section title="Workspace">
              {visible(WORKSPACE_LINKS).map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            </Section>
          </nav>
        </ScrollArea>

        {/* Signed-in user */}
        {user && (
          <NavLink
            to="/profile"
            className="m-3 flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initials(user)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {user.firstname} {user.lastname}
              </span>
              <span className="block truncate text-xs capitalize text-muted-foreground">
                {user.role.toLowerCase()}
              </span>
            </span>
          </NavLink>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
