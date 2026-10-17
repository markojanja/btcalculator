import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { OPEN_TASK_STATUSES, TASK_PRIORITIES } from "../../constants/domain";
import { useActiveClients } from "../../api/clients";
import useFormState from "../../hooks/useFormState";
import RichTextEditor from "../RichTextEditor";
import { SelectField, TextField } from "./fields";

// Starting structure for a new task's description.
const TASK_TEMPLATE =
  "<strong>Affected platform:</strong><br><br><strong>Problem Description:</strong><br><br><strong>Expected outcome:</strong><br><br><strong>Actions done:</strong><br><br><strong>Result of investigation:</strong><br><br><strong>How to reproduce:</strong><br><br><strong>Logs:</strong><br><br>";

const EMPTY_TASK = {
  title: "",
  client: "",
  description: TASK_TEMPLATE,
  status: "TODO",
  priority: "LOW",
};

const TaskForm = ({
  initialValues = EMPTY_TASK,
  submitLabel = "Save",
  onSubmit,
  pending,
}) => {
  const { values, setField } = useFormState(initialValues);
  const { data: activeClients = [] } = useActiveClients();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <FieldGroup>
        <TextField
          label="Title"
          value={values.title}
          onChange={setField("title")}
        />
        <SelectField
          label="Client"
          value={values.client}
          onChange={setField("client")}
          options={activeClients.map((client) => ({
            value: client.id,
            label: client.name,
          }))}
          placeholder="Select client"
        />
        <Field>
          <RichTextEditor
            value={values.description}
            onChange={setField("description")}
          />
        </Field>
      </FieldGroup>
      <FieldGroup className="w-full grid grid-cols-2 gap-4">
        <SelectField
          label="Status"
          value={values.status}
          onChange={setField("status")}
          options={OPEN_TASK_STATUSES}
        />
        <SelectField
          label="Priority"
          value={values.priority}
          onChange={setField("priority")}
          options={TASK_PRIORITIES}
        />
      </FieldGroup>
      <Button className="w-full mt-2" type="submit" disabled={pending}>
        {submitLabel}
      </Button>
    </form>
  );
};

export default TaskForm;
