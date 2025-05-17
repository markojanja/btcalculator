import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, login } = useAuth();

  useEffect(() => {
    if (loading) return; // still checking auth

    if (user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    navigate("/");
  };

  return (
    <div
      className=""
      style={{
        display: "flex",
        flex: "1",
        flexDirection: "column",
        width: "70%",
        margin: "0 auto",
        justifyContent: "center",
      }}
    >
      <form
        action="POST"
        className="login"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <div className="logo">
          <h3>
            <span className="is-active">BT</span>Calculator
          </h3>
        </div>
        <div className="input-group flex-col">
          <label>username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>

        <div className="input-group flex-col">
          <label htmlFor="">password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
