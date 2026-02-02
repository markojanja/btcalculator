import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

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
    <div className="flex flex-col flex-1 items-center justify-center h-screen lg:w-1/3 ml-auto mr-0 bg-secondary">
      <Card className="bg-secondary border-none shadow-none lg:w-90 mx-auto">
        <CardHeader className="font-extrabold text-3xl">
          <h2>
            <span className="text-primary">CS</span>Board
          </h2>
        </CardHeader>
        <CardContent>
          <form
            action="POST"
            className="flex flex-col md:px-4 py-2 w-full gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-1 items-start">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>

            <div className="flex flex-col gap-1 items-start">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
