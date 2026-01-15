import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Authen";

export const GuestRoute = ({ children }) => {
    const { user } = useAuth();
    
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