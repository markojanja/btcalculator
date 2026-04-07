import {
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
} from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const idParents = ["features", "guides", "clients", "users", "task", "tasks"];

const AppBreadcrumb = () => {
  const location = useLocation();
  const { user } = useAuth();
  const segments = location.pathname.split("/").filter(Boolean);

  const routeLabels = {
    dashboard: "Dashboard",
    task: "Task",
    tasks: "Tasks",
    profile: "Profile",
    features: "Features",
    new: "New",
    edit: "Edit",
    guides: "Guides",
    clients: "Clients",
    users: "Users",
    add: "Add User",
    calculators: "Calculators",
    pip: "Pip Value",
    pnl: "Profit & Loss",
    margin: "Margin Calculator",
    swap: "Swap Calculator",
    converter: "Converter",
  };

  const isSupport = user?.role === "SUPPORT";
  const rootLabel = isSupport ? "Tasks" : "Dashboard";
  const rootPath = isSupport ? "/tasks" : "/dashboard";
  const rootSegment = isSupport ? "tasks" : "dashboard";

  const nonClickable = [
    "task",
    "edit",
    "new",
    "add",
    "calculators",
    !isSupport ? "tasks" : null,
  ].filter(Boolean);

  const isUnderRoot = segments[0] === rootSegment;
  const filteredSegments = isUnderRoot ? segments.slice(1) : segments;
  const isOnRootPage = isUnderRoot && segments.length === 1;

  if (!segments.length) return null;

  return (
    <div className="flex w-full px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {isOnRootPage ? (
              <BreadcrumbPage>{rootLabel}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={rootPath}>{rootLabel}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>

          {filteredSegments.map((seg, idx) => {
            const sliced = filteredSegments.slice(0, idx + 1);
            const path = isUnderRoot
              ? "/" + [rootSegment, ...sliced].join("/")
              : "/" + sliced.join("/");
            const isLast = idx === filteredSegments.length - 1;
            const label = routeLabels[seg] || "Details";

            const prevSeg = idx === 0 ? rootSegment : filteredSegments[idx - 1];
            const isId = idParents.includes(prevSeg) && !routeLabels[seg];

            return (
              <div key={path} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast || nonClickable.includes(seg) || isId ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={path}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AppBreadcrumb;
