import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlus, UserRoundPen } from "lucide-react";
import { Input } from "@/components/ui/input";
import useAuth from "../../hooks/useAuth";
import { FormField, FormSection, SelectInput } from "../CalculatorUI";
import { FormActions, FormPage, PageLoading, ToggleRow } from "../PageUI";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ROLE_LABELS = { ADMIN: "Admin", MANAGER: "Manager", SUPPORT: "Support" };

const TextField = ({ label, hint, ...props }) => (
  <FormField label={label} hint={hint}>
    {(id) => <Input id={id} className="h-10" {...props} />}
  </FormField>
);

/** Create a user (no :id in the URL) or edit one (/users/edit/:id). */
const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user: me } = useAuth();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("SUPPORT");
  const [active, setActive] = useState(true);
  const [centroid, setCentroid] = useState(false);

  // Only an ADMIN can create or edit admins and managers (see the backend)
  const roleOptions =
    me?.role === "ADMIN" ? ["SUPPORT", "MANAGER", "ADMIN"] : ["SUPPORT"];
  // Nobody can change their own role or deactivate themselves
  const isSelf = isEdit && me?.id === id;

  useEffect(() => {
    if (!isEdit) return;
    const getUser = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/users/${id}/edit`, {
          withCredentials: true,
        });
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setUsername(data.username);
        setEmail(data.email);
        setRole(data.role);
        setActive(data.active);
        setCentroid(data.centroid);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id, isEdit]);

  // Suggest firstname.lastname as username until it is edited by hand
  useEffect(() => {
    if (isEdit || usernameTouched) return;
    setUsername(
      firstname || lastname
        ? `${firstname.toLowerCase()}.${lastname.toLowerCase()}`
        : "",
    );
  }, [firstname, lastname, isEdit, usernameTouched]);

  const passwordsMatch = password === repeatPassword;
  const passwordValid = password.length >= 8;
  const canSubmit =
    firstname && lastname && username && email &&
    (isEdit || (passwordValid && passwordsMatch));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { firstname, lastname, username, email, role, active, centroid };
    try {
      setSubmitting(true);
      if (isEdit) {
        await axios.put(`${BACKEND_URL}/users/${id}/edit`, body, {
          withCredentials: true,
        });
      } else {
        await axios.post(
          `${BACKEND_URL}/users/new`,
          { ...body, password },
          { withCredentials: true },
        );
      }
      navigate("/users");
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoading />;

  return (
    <FormPage
      backTo="/users"
      backLabel="Back to users"
      icon={isEdit ? UserRoundPen : UserPlus}
      title={isEdit ? `Edit ${firstname} ${lastname}` : "New user"}
      description={
        isEdit
          ? "Update this person's details and access."
          : "Give someone access to CSBoard."
      }
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <FormSection title="Personal details">
          <TextField
            label="First name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            autoComplete="off"
          />
          <TextField
            label="Last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            autoComplete="off"
          />
          <TextField
            label="Username"
            hint={!isEdit && !usernameTouched ? "Filled in from the name." : undefined}
            value={username}
            onChange={(e) => {
              setUsernameTouched(true);
              setUsername(e.target.value);
            }}
            autoComplete="off"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </FormSection>

        {!isEdit && (
          <FormSection title="Password">
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="At least 8 characters."
              autoComplete="new-password"
              aria-invalid={Boolean(password) && !passwordValid}
            />
            <TextField
              label="Repeat password"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              hint={
                repeatPassword && !passwordsMatch
                  ? "Passwords don't match."
                  : undefined
              }
              autoComplete="new-password"
              aria-invalid={Boolean(repeatPassword) && !passwordsMatch}
            />
          </FormSection>
        )}

        <FormSection title="Access" columns={1}>
          <FormField
            label="Role"
            hint={
              isSelf
                ? "You can't change your own role."
                : me?.role !== "ADMIN"
                  ? "Managers can only manage support users."
                  : undefined
            }
          >
            {(fieldId) => (
              <div className={isSelf ? "pointer-events-none opacity-60" : ""}>
                <SelectInput
                  id={fieldId}
                  value={role}
                  onChange={setRole}
                  options={roleOptions.includes(role) ? roleOptions : [role, ...roleOptions]}
                  format={(r) => ROLE_LABELS[r]}
                />
              </div>
            )}
          </FormField>
          <ToggleRow
            id="user-active"
            title="Active"
            description={
              isSelf
                ? "You can't deactivate your own account."
                : "Inactive users can't log in and are logged out right away."
            }
            checked={active}
            onChange={setActive}
            disabled={isSelf}
          />
          <ToggleRow
            id="user-centroid"
            title="Centroid"
            description="Gives access to the swap converter."
            checked={centroid}
            onChange={setCentroid}
          />
        </FormSection>

        <FormActions
          cancelTo="/users"
          submitLabel={isEdit ? "Save changes" : "Create user"}
          submitting={submitting}
          disabled={!canSubmit}
        />
      </form>
    </FormPage>
  );
};

export default UserForm;
