import useKanban from "../hooks/useKanban";
import TaskCard from "./TaskCard";
import { FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const KanbanColumn = ({ name, column, onDragStart, onDrop }) => {
  const { toggleAddTaskModal } = useKanban();

  return (
    <Card
      className={"min-w-80 flex-1 border border-muted"}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(column.colStatus)}
    >
      <CardHeader className={"flex flex-row justify-between items-center"}>
        <CardTitle className={"flex flex-row items-center gap-2"}>
          <h4 className="text-left">{name}</h4>
          <Badge>{column.tasks.length}</Badge>
        </CardTitle>

        {name !== "COMPLETED" && (
          <FaPlus onClick={() => toggleAddTaskModal()} />
        )}
      </CardHeader>
      <Separator />
      <CardContent className={"flex flex-col gap-4 w-full"}>
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
