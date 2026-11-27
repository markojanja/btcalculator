import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/useAuth";
import { FormField } from "./CalculatorUI";
import { Dialog } from "./PageUI";

const PasswordModal = ({ handleToggleModal }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const { logout } = useAuth();

  const longEnough = newPassword.length >= 8;
  const matches = newPassword === repeatPassword;
  const canSubmit = currentPassword && longEnough && matches;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await axios.post(
        `${BACKEND_URL}/auth/passwordchange`,
        { currentPassword, newPassword },
        { withCredentials: true },
      );
      if (res.status === 200) {
        await logout();
        navigate("/login", { replace: true });
      }
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      title="Change password"
      description="You'll be signed out and asked to log in with the new password."
      onClose={handleToggleModal}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField label="Current password">
          {(id) => (
            <Input
              id={id}
              type="password"
              className="h-10"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
            />
          )}
        </FormField>
        <FormField label="New password" hint="At least 8 characters.">
          {(id) => (
            <Input
              id={id}
              type="password"
              className="h-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              aria-invalid={Boolean(newPassword) && !longEnough}
            />
          )}
        </FormField>
        <FormField
          label="Repeat new password"
          hint={repeatPassword && !matches ? "Passwords don't match." : undefined}
        >
          {(id) => (
            <Input
              id={id}
              type="password"
              className="h-10"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              autoComplete="new-password"
              aria-invalid={Boolean(repeatPassword) && !matches}
            />
          )}
        </FormField>
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleToggleModal}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit || submitting}>
            {submitting ? "Changing…" : "Change password"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default PasswordModal;
