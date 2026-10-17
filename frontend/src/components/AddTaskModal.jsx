import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { taskKeys, tasksApi } from "../api/tasks";
import useKanban from "../hooks/useKanban";
import FullScreenPanel from "./FullScreenPanel";
import TaskForm from "./form/TaskForm";

const AddTaskModal = () => {
  const queryClient = useQueryClient();
  const { closePanel } = useKanban();

  const create = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.board });
      closePanel();
    },
  });

  return (
    <FullScreenPanel onClose={closePanel}>
      <Card className="w-full lg:w-175">
        <CardTitle className="px-6 pt-6">
          <h3 className="text-left font-bold">Add task</h3>
        </CardTitle>
        <CardContent>
          <TaskForm onSubmit={create.mutate} pending={create.isPending} />
        </CardContent>
      </Card>
    </FullScreenPanel>
  );
};

export default AddTaskModal;
