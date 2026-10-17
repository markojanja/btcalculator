import ReactSelect from "react-select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CLIENT_STATUSES, PLATFORMS, SERVERS } from "../../constants/domain";
import useFormState from "../../hooks/useFormState";
import { SelectField, TextField } from "./fields";

const EMPTY_CLIENT = {
  name: "",
  status: "ACTIVE",
  server: "live1",
  platform: [],
};

const toOption = (value) => ({ value, label: value });

// react-select themed with the app's CSS variables.
const multiSelectStyles = {
  container: (base) => ({
    ...base,
    width: "100%",
    backgroundColor: "var(--secondary)",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--secondary)",
    marginTop: 0,
    borderRadius: 0,
  }),
  control: (base) => ({
    ...base,
    backgroundColor: "var(--secondary)",
    boxShadow: "none",
    borderColor: "var(--text-color)",
    minHeight: "40px",
    "&:hover": { borderColor: "var(--accent-color)" },
  }),
  multiValue: (base) => ({ ...base, backgroundColor: "var(--primary)" }),
  multiValueLabel: (base) => ({ ...base, color: "#fff" }),
  option: (base) => ({
    ...base,
    backgroundColor: "var(--secondary)",
    color: "var(--primary)",
    "&:hover": { backgroundColor: "var(--primary)", color: "#fff" },
  }),
};

const ClientForm = ({ initialValues = EMPTY_CLIENT, onSubmit, pending }) => {
  const { values, setField } = useFormState(initialValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup>
        <TextField label="Name" value={values.name} onChange={setField("name")} />
        <SelectField
          label="Status"
          value={values.status}
          onChange={setField("status")}
          options={CLIENT_STATUSES}
          placeholder="Select status"
        />
        <SelectField
          label="Server"
          value={values.server}
          onChange={setField("server")}
          options={SERVERS}
          placeholder="Select server"
        />
        <Field>
          <Label>Platforms</Label>
          <ReactSelect
            isMulti
            options={PLATFORMS.map(toOption)}
            value={values.platform.map(toOption)}
            onChange={(selected) =>
              setField("platform")(selected.map((option) => option.value))
            }
            styles={multiSelectStyles}
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending}>
        Save
      </Button>
    </form>
  );
};

export default ClientForm;
