import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Same colours as the task board columns (KanbanColumn.jsx). Class names are
// written out in full so Tailwind can find them.
const TONES = {
  red: {
    card: "bg-red-50 border-red-200 hover:border-red-300 dark:bg-red-950/40 dark:border-red-900 dark:hover:border-red-800",
    icon: "bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300",
    title: "text-red-700 dark:text-red-300",
  },
  blue: {
    card: "bg-blue-50 border-blue-200 hover:border-blue-300 dark:bg-blue-950/40 dark:border-blue-900 dark:hover:border-blue-800",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300",
    title: "text-blue-700 dark:text-blue-300",
  },
  amber: {
    card: "bg-amber-50 border-amber-200 hover:border-amber-300 dark:bg-amber-950/40 dark:border-amber-900 dark:hover:border-amber-800",
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300",
    title: "text-amber-800 dark:text-amber-300",
  },
  emerald: {
    card: "bg-emerald-50 border-emerald-200 hover:border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900 dark:hover:border-emerald-800",
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300",
    title: "text-emerald-700 dark:text-emerald-300",
  },
};

// A status count that links to the task list for that status.
const DashCard = ({ title, value, description, href, Icon, tone = "blue" }) => {
  const styles = TONES[tone] ?? TONES.blue;

  return (
    <Link
      to={href}
      className={cn(
        "group flex flex-col gap-4 rounded-xl border p-5 text-left transition",
        "hover:-translate-y-0.5 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        styles.card,
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-sm font-semibold", styles.title)}>
          {title}
        </span>
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            styles.icon,
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground transition group-hover:text-foreground">
          View
          <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};

export default DashCard;
