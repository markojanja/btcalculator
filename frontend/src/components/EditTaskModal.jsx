import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { taskKeys, tasksApi } from "../api/tasks";
import useKanban from "../hooks/useKanban";
import FullScreenPanel from "./FullScreenPanel";
import TaskComments from "./TaskComments";
import TaskForm from "./form/TaskForm";

// The editable fields of a task returned by the API.
const taskToFormValues = (task) => ({
  title: task.title,
  client: task.clientId ?? "",
  description: task.description,
  status: task.status,
  priority: task.priority,
});

const EditTaskModal = () => {
  const queryClient = useQueryClient();
  const { activeTask: task, closePanel } = useKanban();

  const done = () => {
    queryClient.invalidateQueries({ queryKey: taskKeys.board });
    closePanel();
  };

  const update = useMutation({
    mutationFn: (values) => tasksApi.update({ id: task.id, ...values }),
    onSuccess: done,
  });

  const remove = useMutation({
    mutationFn: () => tasksApi.remove(task.id),
    onSuccess: done,
  });

  return (
    <FullScreenPanel onClose={closePanel}>
      <div className="flex flex-col w-full max-w-175 gap-6">
        <Card className="w-full">
          <CardTitle className="px-6 pt-6">
            <h3 className="text-left font-bold">Edit task</h3>
          </CardTitle>
          <CardContent className="flex flex-col gap-2">
            <TaskForm
              initialValues={taskToFormValues(task)}
              submitLabel="Save changes"
              onSubmit={update.mutate}
              pending={update.isPending}
            />
            <Button
              type="button"
              variant="destructive"
              aria-label="Delete task"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
        <TaskComments taskId={task.id} />
      </div>
    </FullScreenPanel>
  );
};

export default EditTaskModal;
