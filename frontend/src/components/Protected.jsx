import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";

const Protected = ({roles=[]}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
    }
    else if(roles.length && !roles.includes(user.role)){
      navigate('/login',{replace:true})
    }
  }, [user, loading, navigate]);

  if (loading) return <Loading />;

  return user && (!roles.length || roles.includes(user.role))? <Outlet /> : null;
};

export default Protected;
