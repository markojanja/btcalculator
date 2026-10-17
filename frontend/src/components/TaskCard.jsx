import { Calendar, ChevronsDown, ChevronsUp, CircleUserRound, Equal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useKanban from "../hooks/useKanban";
import { formatDate } from "../lib/format";

const PRIORITY_ICONS = {
  LOW: <ChevronsDown className="h-4 w-4 text-lime-500" />,
  MEDIUM: <Equal className="h-4 w-4 text-cyan-500" />,
  HIGH: <ChevronsUp className="h-4 w-4 text-red-500" />,
};

const TaskCard = ({ task, onDragStart }) => {
  const { openEdit } = useKanban();

  return (
    <Card
      className="p-2 gap-2 border border-muted flex-0 min-w-65 cursor-pointer"
      draggable
      onDragStart={() => onDragStart(task)}
      onClick={() => openEdit(task)}
    >
      <CardHeader className="items-start text-left px-4">
        <CardTitle>
          <h4>{task.title}</h4>
        </CardTitle>
        {task.client && <Badge>{task.client.name}</Badge>}
      </CardHeader>
      <CardContent className="items-start text-left gap-4 px-4">
        <span className="flex items-center gap-0.5 text-sm">
          <Calendar size={12} /> {formatDate(task.createdAt)}
        </span>
        <p className="flex items-center gap-1 lowercase">
          {PRIORITY_ICONS[task.priority]}
          <span className="task-span">{task.priority}</span>
        </p>
      </CardContent>
      <CardFooter className="justify-between items-center flex-0 text-sm px-4">
        <p className="flex items-center justify-center gap-1">
          <CircleUserRound className="h-4 w-4" /> <span>{task.user.username}</span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
