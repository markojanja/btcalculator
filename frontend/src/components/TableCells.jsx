import { ChevronsDown, ChevronsUp, Equal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Bordered table with a tinted header row. `columns` are header labels. */
export const DataTable = ({ columns, children }) => (
  <div className="overflow-hidden rounded-lg border">
    <Table containerClassName="py-0">
      <TableHeader className="bg-muted/50">
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead
              key={column}
              className="h-10 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="[&_td]:px-4 [&_td]:py-3">{children}</TableBody>
    </Table>
  </div>
);

/** A row that opens something on click, Enter or Space. */
export const ClickableRow = ({ onOpen, className, children }) => (
  <TableRow
    tabIndex={0}
    onClick={onOpen}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen();
      }
    }}
    className={cn(
      "cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none",
      className,
    )}
  >
    {children}
  </TableRow>
);

// Shared cells for tables. Colours match the task board and task cards.
// Class names are written out in full so Tailwind can find them.

const pill =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium";

const TASK_STATUS = {
  TODO: { label: "To do", dot: "bg-red-500", pill: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300" },
  IN_PROGRESS: { label: "In progress", dot: "bg-blue-500", pill: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" },
  CS_TICKET: { label: "CS ticket", dot: "bg-amber-500", pill: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" },
  IT_TICKET: { label: "IT ticket", dot: "bg-violet-500", pill: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300" },
  COMPLETED: { label: "Completed", dot: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" },
};

const PRIORITY = {
  HIGH: { label: "High", icon: ChevronsUp, className: "text-red-600 dark:text-red-400" },
  MEDIUM: { label: "Medium", icon: Equal, className: "text-amber-600 dark:text-amber-400" },
  LOW: { label: "Low", icon: ChevronsDown, className: "text-emerald-600 dark:text-emerald-400" },
};

const CLIENT_STATUS = {
  ACTIVE: { label: "Active", dot: "bg-emerald-500" },
  ONBOARDING: { label: "Onboarding", dot: "bg-blue-500" },
  SUSPENDED: { label: "Suspended", dot: "bg-amber-500" },
  INACTIVE: { label: "Inactive", dot: "bg-slate-400" },
};

const ROLE = {
  ADMIN: "bg-primary/15 text-primary",
  MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  SUPPORT: "bg-muted text-muted-foreground",
};

export const TaskStatusBadge = ({ status }) => {
  const s = TASK_STATUS[status];
  if (!s) return <span className={cn(pill, "bg-muted")}>{status}</span>;
  return (
    <span className={cn(pill, s.pill)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
};

export const PriorityLabel = ({ priority }) => {
  const p = PRIORITY[priority];
  if (!p) return <span className="text-muted-foreground">{priority}</span>;
  const Icon = p.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", p.className)}>
      <Icon className="size-4" />
      {p.label}
    </span>
  );
};

export const ClientStatusLabel = ({ status }) => {
  const s = CLIENT_STATUS[status] ?? { label: status, dot: "bg-slate-400" };
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={cn("size-2 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
};

export const RoleBadge = ({ role }) => (
  <span className={cn(pill, ROLE[role] ?? "bg-muted")}>
    {role.charAt(0) + role.slice(1).toLowerCase()}
  </span>
);

const initials = (...names) =>
  names
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");

/** Initials avatar + name, with an optional second line (e.g. email). */
export const PersonCell = ({ firstname, lastname, subtitle }) => (
  <div className="flex items-center gap-3">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
      {initials(firstname, lastname) || "?"}
    </span>
    <div className="min-w-0">
      <p className="truncate font-medium">
        {[firstname, lastname].filter(Boolean).join(" ")}
      </p>
      {subtitle && (
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  </div>
);

export const DateCell = ({ value }) => (
  <span className="whitespace-nowrap tabular-nums text-muted-foreground">
    {new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}
  </span>
);

/** One full-width row for empty tables. */
export const EmptyRow = ({ colSpan, children = "Nothing here yet" }) => (
  <tr>
    <td colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
      {children}
    </td>
  </tr>
);
