import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "./RichTextEditor";
import { FormField, SegmentedControl, SelectInput } from "./CalculatorUI";

const STATUS_LABELS = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  CS_TICKET: "CS ticket",
  IT_TICKET: "IT ticket",
  COMPLETED: "Completed",
};
const PRIORITY_LABELS = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" };

/** Fields shared by the add-task and edit-task dialogs. */
const TaskFields = ({
  title,
  setTitle,
  client,
  setClient,
  clients,
  content,
  setContent,
  uploadImage,
  status,
  setStatus,
  statuses,
  priority,
  setPriority,
  priorities,
}) => (
  <div className="flex flex-col gap-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Title">
        {(id) => (
          <Input
            id={id}
            className="h-10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary of the issue"
            autoFocus
          />
        )}
      </FormField>
      <FormField label="Client">
        {(id) => (
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger id={id} className="h-10 w-full">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormField>
      <FormField label="Status">
        {(id) => (
          <SelectInput
            id={id}
            value={status}
            onChange={setStatus}
            options={statuses}
            format={(s) => STATUS_LABELS[s]}
          />
        )}
      </FormField>
      <FormField label="Priority">
        <SegmentedControl
          value={priority}
          onChange={setPriority}
          options={priorities}
          format={(p) => PRIORITY_LABELS[p]}
        />
      </FormField>
    </div>
    <FormField label="Description">
      <div className="text-left">
        <RichTextEditor
          value={content}
          onChange={setContent}
          uploadImage={uploadImage}
        />
      </div>
    </FormField>
  </div>
);

export default TaskFields;
