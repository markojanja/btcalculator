import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { adminKeys, useAdminTask } from "../api/admin";
import { taskKeys, tasksApi } from "../api/tasks";
import { TASK_PRIORITIES, TASK_STATUSES } from "../constants/domain";
import useFormState from "../hooks/useFormState";
import { SelectField } from "../components/form/fields";
import HtmlContent from "../components/HtmlContent";
import TaskComments from "../components/TaskComments";
import Loading from "../components/Loading";

// Assignment, status and priority, as staff can change them.
const AssignmentForm = ({ task, users, onSubmit, pending }) => {
  const { values, setField } = useFormState({
    userId: task.userId,
    status: task.status,
    priority: task.priority,
  });

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <FieldGroup className="flex flex-row items-center">
          <SelectField
            label="User"
            value={values.userId}
            onChange={setField("userId")}
            options={users.map((user) => ({
              value: user.id,
              label: user.firstname,
            }))}
            placeholder="Select user"
          />
          <SelectField
            label="Status"
            value={values.status}
            onChange={setField("status")}
            options={TASK_STATUSES}
            placeholder="Select status"
          />
          <SelectField
            label="Priority"
            value={values.priority}
            onChange={setField("priority")}
            options={TASK_PRIORITIES}
            placeholder="Select priority"
          />
        </FieldGroup>
        <Button
          className="w-full"
          disabled={pending}
          onClick={() => onSubmit({ id: task.id, ...values })}
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
};

const AdminTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useAdminTask(id);

  const update = useMutation({
    mutationFn: tasksApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      navigate(-1);
    },
  });

  if (isLoading || !data) return <Loading />;
  const { task, users } = data;

  return (
    <div className="flex flex-col w-full md:w-187.5 mx-auto gap-4 p-2">
      <CardTitle className="flex justify-between items-center w-full bg-card shadow-sm p-4 rounded-md">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        {task.client && <Badge>{task.client.name}</Badge>}
      </CardTitle>
      <Card>
        <HtmlContent
          html={task.description}
          className="flex flex-col overflow-y-auto max-h-screen text-left p-4 gap-4"
        />
      </Card>
      <AssignmentForm
        key={task.id}
        task={task}
        users={users}
        onSubmit={update.mutate}
        pending={update.isPending}
      />
      <TaskComments taskId={task.id} />
    </div>
  );
};

export default AdminTask;
