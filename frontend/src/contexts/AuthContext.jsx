import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/auth/status", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    checkIfLoggedIn();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { username, password },
        { withCredentials: true }
      );
      console.log(response.data.user);
      setUser(response.data.user);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      setError(err);
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
