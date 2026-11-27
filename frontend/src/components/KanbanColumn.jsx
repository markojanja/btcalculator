import { useState } from "react";
import { Plus } from "lucide-react";
import useKanban from "../hooks/useKanban";
import TaskCard from "./TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// One colour per status (cards use a slightly darker shade of their column). Class names are written out in full so Tailwind
// can find them; each has a light and a dark variant.
const COLUMN_STYLES = {
  TODO: {
    column: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200",
    ring: "ring-red-400",
    card: "bg-red-100 border-red-200 dark:bg-red-900/40 dark:border-red-800",
  },
  IN_PROGRESS: {
    column: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200",
    ring: "ring-blue-400",
    card: "bg-blue-100 border-blue-200 dark:bg-blue-900/40 dark:border-blue-800",
  },
  CS_TICKET: {
    column: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
    ring: "ring-amber-400",
    card: "bg-amber-100 border-amber-200 dark:bg-amber-900/40 dark:border-amber-800",
  },
  IT_TICKET: {
    column: "bg-violet-50 border-violet-200 dark:bg-violet-950/40 dark:border-violet-900",
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200",
    ring: "ring-violet-400",
    card: "bg-violet-100 border-violet-200 dark:bg-violet-900/40 dark:border-violet-800",
  },
  COMPLETED: {
    column: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200",
    ring: "ring-emerald-400",
    card: "bg-emerald-100 border-emerald-200 dark:bg-emerald-900/40 dark:border-emerald-800",
  },
};

const KanbanColumn = ({ name, column, onDragStart, onDrop }) => {
  const { toggleAddTaskModal } = useKanban();
  const [isOver, setIsOver] = useState(false);
  const styles = COLUMN_STYLES[column.colStatus] ?? COLUMN_STYLES.TODO;

  return (
    <Card
      className={cn(
        "min-w-80 flex-1 gap-0 border py-0 shadow-none transition-shadow",
        styles.column,
        isOver && ["ring-2 ring-offset-2 ring-offset-background", styles.ring],
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isOver) setIsOver(true);
      }}
      onDragLeave={(e) => {
        // ignore leaving into a child element (a task card)
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false);
      }}
      onDrop={() => {
        setIsOver(false);
        onDrop(column.colStatus);
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <CardTitle className="flex flex-row items-center gap-2 text-sm font-semibold uppercase tracking-wide">
          <span className={cn("size-2.5 rounded-full", styles.dot)} />
          <h4 className="text-left">{name}</h4>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
              styles.badge,
            )}
          >
            {column.tasks.length}
          </span>
        </CardTitle>

        {column.colStatus !== "COMPLETED" && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => toggleAddTaskModal()}
            aria-label={`Add task to ${name}`}
            className="hover:bg-background/60"
          >
            <Plus />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex w-full flex-col gap-3 px-3 pb-3">
        {column.tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-foreground/15 py-8 text-center text-sm text-muted-foreground">
            No tasks
          </p>
        ) : (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              className={styles.card}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
