import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const IndexPageRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
    }
    if (user?.role === "ADMIN" || user?.role === "MANAGER") {
      navigate("/dashboard", { replace: true });
    }
    if (user?.role === "SUPPORT") {
      navigate("/tasks", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <Loading />;

  return null;
};

export default IndexPageRedirect;
