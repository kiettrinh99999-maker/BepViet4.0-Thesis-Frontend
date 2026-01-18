import { useAuth } from "../contexts/Authen";
//Kiểm tra role user trước khi quyết định trả về layout nào
export const GuestRoute = ({ children }) => {
    const { user } = useAuth();
    return user?.role === 'member' ? children[1] : children[0];
};