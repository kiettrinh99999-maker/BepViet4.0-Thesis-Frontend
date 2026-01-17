import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/Authen';
import { GuestRoute } from './protecteds/RouteRedirect';
import GuestLayout from './layouts/guest';
import MemberLayout from './layouts/user';
import ForumPage from './pages/forums/list_forum';
// Tạo nhanh vài component để test hiển thị
const HomePage = () => <h1>Trang chủ (Guest)</h1>;
const Dashboard = () => <h1>Đây là Dashboard (Member)</h1>;
const AdminPage = () => <h1>Đây là Admin Page</h1>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- NHÓM 1: GUEST --- */}
          {/* Logic: Nếu là member -> Đá sang dashboard. Nếu chưa -> Hiện Layout */}
          <Route element={<GuestRoute><GuestLayout /></GuestRoute>}>
            {/* PHẢI CÓ ROUTE CON Ở ĐÂY */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<div>Trang Login</div>} />
            <Route path="/forum" element={<ForumPage/>} />
            
          </Route>
          {/* --- NHÓM 2: MEMBER (Đích đến) --- */}
          {/* Cần khai báo route này thì Navigate to="/dashboard" mới chạy được */}
          <Route path="/dashboard" element={<MemberLayout showLoginNotice={false} />} />
          {/* --- NHÓM 3: ADMIN (Đích đến) --- */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;