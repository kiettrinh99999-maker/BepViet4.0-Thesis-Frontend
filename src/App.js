import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/Authen';
import { GuestRoute } from './protecteds/RouteRedirect';
import GuestLayout from './layouts/guest';
import MemberLayout from './layouts/user';
import AdminLayout from './layouts/admin';
// Tạo nhanh vài component để test hiển thị
import ShoppingList from './pages/shoppinglists/shoppinglist';
import ForumPage from './pages/forums/list_forum';
import ForumDetailPage from './pages/forums/detail_forum';
import { RouterProtected } from './protecteds/RouteProtected';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- NHÓM 1: GUEST --- */}
          <Route element={<GuestRoute><GuestLayout /><MemberLayout /></GuestRoute>}>
            {/* PHẢI CÓ ROUTE CON Ở ĐÂY */}
            <Route path="/" element={<h1>Cài đặt trang chủ tại đây</h1>} />
            <Route path="/cong-thuc" element={<h1>Cài trang công thức tại đây</h1>} />
            <Route path="/dien-dan" element={<ForumPage />} />
            <Route path="/dien-dan/cau-hoi/:id" element={<ForumDetailPage />} />
            <Route path="/blog" element={<h1>Cài trang blog tại đây</h1>} />
            {/*Những đường dẫn mà phải đăng nhập được kiểm tra tại đây */}
            <Route element={<RouterProtected />}>
              <Route path="/shopping-list" element={<ShoppingList/>} />
              <Route path="/meal-plan" element={<h1>Meal</h1>} />
              <Route path="/profile" element={<h1>Profile</h1>} />
            </Route>
            {/*Những đường dẫn mà phải đăng nhập được kiểm tra tại đây */}

          </Route>
          <Route path="/login" element={<div>Trang Login</div>} />
          <Route path="/register" element={<div>Trang Đăng ký</div>} />
          {/* --- NHÓM 2: ADMIN (Đích đến) --- */}
          <Route path="/admin" element={<AdminLayout/>}>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;