import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/Authen";

export const RouterProtected = () => {
  const { user } = useAuth();

  return user?.role === "member"
    ? <Outlet />
    : <Navigate to="/login" />;
};
