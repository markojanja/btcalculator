import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useKanban from "../hooks/useKanban";
import TaskCard from "./TaskCard";

const KanbanColumn = ({ column, onDragStart, onDrop }) => {
  const { openAdd } = useKanban();

  return (
    <Card
      className="min-w-80 flex-1 border border-muted"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(column.colStatus)}
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex flex-row items-center gap-2">
          <h4 className="text-left">{column.title}</h4>
          <Badge>{column.tasks.length}</Badge>
        </CardTitle>
        {column.colStatus !== "COMPLETED" && (
          <button type="button" aria-label="Add task" onClick={openAdd}>
            <Plus className="h-4 w-4" />
          </button>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4 w-full">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
