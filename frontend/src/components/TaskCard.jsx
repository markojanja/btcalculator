import { format } from "date-fns";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaAnglesUp, FaAnglesDown } from "react-icons/fa6";
import { TiEquals } from "react-icons/ti";
import { Calendar } from "lucide-react";
import useKanban from "../hooks/useKanban";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TaskCard = ({ task, onDragStart }) => {
  const { toggleEditTaskModal, deleteTask, setActiveTask } = useKanban();

  const toggleModal = (task) => {
    setActiveTask(task);
    toggleEditTaskModal();
    console.log(task);
  };

  return (
    <Card
      className={"p-2 gap-2 border border-muted flex-0 min-w-65"}
      draggable
      onDragStart={() => onDragStart(task)}
    >
      <CardHeader className={"items-start text-left "}>
        <CardTitle>
          <h4>{task.title}</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className={"items-start text-left gap-4"}>
        <span className="flex items-center gap-0.5 text-sm">
          <Calendar size={12} /> {format(task.createdAt, "dd/MM/yyyy")}
        </span>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            textTransform: "lowercase",
            color: "gray",
          }}
        >
          {task.priority === "LOW" && (
            <>
              <FaAnglesDown style={{ fill: "lime" }} />{" "}
              <span className="task-span">{task.priority}</span>
            </>
          )}
          {task.priority === "MEDIUM" && (
            <>
              <TiEquals style={{ fill: "cyan" }} />{" "}
              <span className="task-span">{task.priority}</span>
            </>
          )}
          {task.priority === "HIGH" && (
            <>
              <FaAnglesUp style={{ fill: "red" }} />{" "}
              <span className="task-span">{task.priority}</span>
            </>
          )}
        </p>
      </CardContent>
      <CardFooter className={"justify-between items-center flex-0 text-sm"}>
        <p className="flex items-center justify-center gap-0.5">
          <CgProfile /> <span>{task.user.username}</span>
        </p>
        <div className="flex items-center justify-center gap-1">
          <FaRegEdit onClick={() => toggleModal(task)} />
          <MdDeleteOutline
            onClick={() => {
              deleteTask(task);
            }}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
