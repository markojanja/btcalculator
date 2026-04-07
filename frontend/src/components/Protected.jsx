import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";

const Protected = ({ roles = [] }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const memoRoles = useMemo(() => roles, [roles.join(",")]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
    } else if (memoRoles.length && !memoRoles.includes(user.role)) {
      navigate("/unauthorized", { replace: true });
    }
  }, [user, loading, navigate, memoRoles]);

  if (loading) return <Loading />;
  if (!user) return null;
  if (memoRoles.length && !memoRoles.includes(user.role)) return null;

  return <Outlet />;
};

export default Protected;
