import axios from "axios";
import { useState } from "react";
import "./PasswordModal.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PasswordModal = () => {
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
        { withCredentials: true }
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
    <div className="password-modal">
      <form className="password-form" onSubmit={handleSubmit}>
        <h3>Change password</h3>
        <input
          type="password"
          placeholder="Current Passwrod"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Passwrod"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button>Change password</button>
      </form>
    </div>
  );
};

export default PasswordModal;
