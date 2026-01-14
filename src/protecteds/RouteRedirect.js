import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Authen";

export const GuestRoute = ({ children }) => {
    const { user } = useAuth();
    console.log(user)
    if (user) {
        if (user.role === "member") {
            return <Navigate to="/dashboard" replace />;
        }
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
    }
    return children ? children : <Outlet />;
}