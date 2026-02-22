import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CgClose } from "react-icons/cg";

const PasswordModal = ({ handleToggleModal }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/passwordchange`,
        { currentPassword, newPassword },
        { withCredentials: true },
      );
      console.log(res);
      if (res.status === 200) {
        await logout();
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background p-2">
      <Card className={"w-full lg:w-1/4"}>
        <CardTitle className={"flex justify-end mr-6"}>
          <CgClose onClick={handleToggleModal} />
        </CardTitle>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Label>Change password</Label>
            <Input
              type="password"
              placeholder="Current Passwrod"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Passwrod"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button>Change password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordModal;
