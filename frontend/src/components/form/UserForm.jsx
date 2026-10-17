import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ROLES } from "../../constants/domain";
import { humanize } from "../../lib/format";
import useFormState from "../../hooks/useFormState";
import { CheckboxField, SelectField, TextField } from "./fields";

const EMPTY_USER = {
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
  role: "SUPPORT",
  active: true,
  centroid: false,
};

const MIN_PASSWORD = 8;

const suggestUsername = (firstname, lastname) =>
  firstname || lastname
    ? `${firstname.toLowerCase()}.${lastname.toLowerCase()}`
    : "";

// New users get password fields and a username suggested from their name.
const UserForm = ({ initialValues = EMPTY_USER, isNew, onSubmit, pending }) => {
  const { values, setValues, setField } = useFormState({
    ...EMPTY_USER,
    ...initialValues,
  });

  const setName = (name) => (value) =>
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      return isNew
        ? { ...next, username: suggestUsername(next.firstname, next.lastname) }
        : next;
    });

  const passwordTooShort =
    values.password.length > 0 && values.password.length < MIN_PASSWORD;
  const passwordsDiffer =
    values.repeatPassword.length > 0 && values.password !== values.repeatPassword;
  const passwordValid =
    !isNew ||
    (values.password.length >= MIN_PASSWORD &&
      values.password === values.repeatPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstname, lastname, username, email, role, active, centroid } =
      values;
    const user = { firstname, lastname, username, email, role, active, centroid };
    onSubmit(isNew ? { ...user, password: values.password } : user);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FieldGroup>
        <TextField
          label="Firstname"
          value={values.firstname}
          onChange={setName("firstname")}
        />
        <TextField
          label="Lastname"
          value={values.lastname}
          onChange={setName("lastname")}
        />
        <TextField
          label="Username"
          value={values.username}
          onChange={setField("username")}
        />
        <TextField
          label="Email"
          type="email"
          value={values.email}
          onChange={setField("email")}
        />
        {isNew && (
          <>
            <TextField
              label="Password"
              type="password"
              value={values.password}
              onChange={setField("password")}
            />
            {passwordTooShort && (
              <p className="text-sm text-destructive">
                Password must be at least {MIN_PASSWORD} characters.
              </p>
            )}
            <TextField
              label="Repeat Password"
              type="password"
              value={values.repeatPassword}
              onChange={setField("repeatPassword")}
            />
            {passwordsDiffer && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}
          </>
        )}
        <SelectField
          label="Role"
          value={values.role}
          onChange={setField("role")}
          options={ROLES.map((role) => ({ value: role, label: humanize(role) }))}
          placeholder="Select role"
        />
        <CheckboxField
          label="Active"
          checked={values.active}
          onChange={setField("active")}
        />
        <CheckboxField
          label="Centroid"
          checked={values.centroid}
          onChange={setField("centroid")}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={pending || !passwordValid}
        >
          {isNew ? "Create" : "Save"}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default UserForm;
