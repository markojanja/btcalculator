import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "../lib/api";
import useAuth from "../hooks/useAuth";

const PasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  // The server ends the session after a password change, so log in again.
  const change = useMutation({
    mutationFn: () =>
      api.post("/auth/passwordchange", { currentPassword, newPassword }),
    onSuccess: async () => {
      await logout();
      navigate("/login", { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    change.mutate();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background p-2">
      <Card className="w-full lg:w-1/4">
        <CardTitle className="flex justify-end mr-6">
          <button type="button" aria-label="Close" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </CardTitle>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Label>Change password</Label>
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New password (at least 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="submit" disabled={change.isPending}>
              Change password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordModal;
