import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskKeys, tasksApi, useBoard } from "../api/tasks";
import useKanban from "../hooks/useKanban";
import KanbanColumn from "./KanbanColumn";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import HandoverModal from "./HandoverModal";

const moveTask = (columns, task, status) =>
  columns.map((col) => {
    if (col.colStatus === task.status) {
      return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) };
    }
    if (col.colStatus === status) {
      return { ...col, tasks: [...col.tasks, { ...task, status }] };
    }
    return col;
  });

const Kanban = () => {
  const queryClient = useQueryClient();
  const { panel, activeTask } = useKanban();
  const { data: columns = [] } = useBoard();
  const [draggedTask, setDraggedTask] = useState(null);

  // Moves the card straight away and puts it back if the server refuses.
  const changeStatus = useMutation({
    mutationFn: ({ task, status }) => tasksApi.update({ id: task.id, status }),
    onMutate: async ({ task, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.board });
      const previous = queryClient.getQueryData(taskKeys.board);
      queryClient.setQueryData(taskKeys.board, (cols) =>
        moveTask(cols, task, status),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(taskKeys.board, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.board });
    },
  });

  const handleDrop = (status) => {
    if (draggedTask && draggedTask.status !== status) {
      changeStatus.mutate({ task: draggedTask, status });
    }
    setDraggedTask(null);
  };

  if (panel === "add") return <AddTaskModal />;
  if (panel === "edit" && activeTask) return <EditTaskModal />;
  if (panel === "handover") return <HandoverModal />;

  return (
    <div className="flex flex-row flex-1 justify-evenly w-full h-screen p-6 gap-6 overflow-x-auto bg-background">
      {columns.map((col) => (
        <KanbanColumn
          key={col.colStatus}
          column={col}
          onDragStart={setDraggedTask}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};

export default Kanban;
