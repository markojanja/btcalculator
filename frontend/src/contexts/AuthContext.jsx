import { createContext, useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, setUnauthorizedHandler } from "../lib/api";
import Loading from "../components/Loading";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dropping the user sends Protected routes back to /login.
  const clearSession = useCallback(() => {
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
  }, [clearSession]);

  useEffect(() => {
    api
      .get("/auth/status")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      setLoginLoading(true);
      const response = await api.post("/auth/login", { username, password });
      setUser(response.data.user);
    } catch (err) {
      setError(err);
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearSession();
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, error, loading, loginLoading, login, logout, clearError }}
    >
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
