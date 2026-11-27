import { format } from "date-fns";
import {
  Building2,
  Calendar,
  ChevronsDown,
  ChevronsUp,
  Equal,
  MessageSquare,
} from "lucide-react";
import useKanban from "../hooks/useKanban";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Priority badge styles. Class names are written out in full so Tailwind
// can find them.
const PRIORITY_STYLES = {
  HIGH: {
    label: "High",
    icon: ChevronsUp,
    pill: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  },
  MEDIUM: {
    label: "Medium",
    icon: Equal,
    pill: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  },
  LOW: {
    label: "Low",
    icon: ChevronsDown,
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
};

const initials = (name = "") =>
  name
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const TaskCard = ({ task, onDragStart, className }) => {
  const { toggleEditTaskModal, setActiveTask } = useKanban();
  const priority = PRIORITY_STYLES[task.priority];
  const PriorityIcon = priority?.icon;
  const commentCount = task.taskComments?.length ?? 0;
  const username = task.user?.username ?? "";

  const openTask = () => {
    setActiveTask(task);
    toggleEditTaskModal();
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      draggable
      onDragStart={() => onDragStart(task)}
      onClick={openTask}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openTask();
        }
      }}
      className={cn(
        "min-w-65 flex-0 cursor-grab gap-3 border p-4 text-left shadow-sm transition",
        "hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className, // column tint, e.g. bg-blue-100 border-blue-200
      )}
    >
      {/* Title + priority */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold leading-snug">{task.title}</h4>
        {priority && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              priority.pill,
            )}
          >
            <PriorityIcon className="size-3.5" />
            {priority.label}
          </span>
        )}
      </div>

      {/* Client */}
      {task.client?.name && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-background/60 px-2 py-1 text-xs font-medium text-muted-foreground">
          <Building2 className="size-3.5" />
          {task.client.name}
        </span>
      )}

      {/* Footer: date, comments, owner */}
      <div className="mt-1 flex items-center justify-between border-t border-current/10 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            {format(task.createdAt, "dd/MM/yyyy")}
          </span>
          {commentCount > 0 && (
            <span
              className="inline-flex items-center gap-1"
              title={`${commentCount} comment${commentCount === 1 ? "" : "s"}`}
            >
              <MessageSquare className="size-3.5" />
              {commentCount}
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5" title={username}>
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {initials(username)}
          </span>
          <span className="max-w-24 truncate">{username}</span>
        </span>
      </div>
    </Card>
  );
};

export default TaskCard;
