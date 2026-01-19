import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/Authen';
import { GuestRoute } from './protecteds/RouteRedirect';
import GuestLayout from './layouts/guest';
import MemberLayout from './layouts/user';
import RecipesPage from './pages/recipe';
// Tạo nhanh vài component để test hiển thị
import ShoppingList from './pages/shoppinglists/shoppinglist';
import ForumPage from './pages/forums/list_forum';
import { RouterProtected } from './protecteds/RouteProtected';
import ListRecipe from './pages/recipes/list_recipe';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- NHÓM 1: GUEST --- */}
          <Route element={<GuestRoute><GuestLayout /><MemberLayout /></GuestRoute>}>
            {/* PHẢI CÓ ROUTE CON Ở ĐÂY */}
            <Route path="/" element={<h1>Cài đặt trang chủ tại đây</h1>} />
            <Route path="/cong-thuc" element={<ListRecipe />} />
            <Route path="/dien-dan" element={<ForumPage />} />
            <Route path="/blog" element={<h1>Cài trang blog tại đây</h1>} />
            {/*Những đường dẫn mà phải đăng nhập được kiểm tra tại đây */}
            <Route element={<RouterProtected />}>
              <Route path="/shopping-list" element={<ShoppingList/>} />
              <Route path="/meal-plan" element={<h1>Meal</h1>} />
              <Route path="/profile" element={<h1>Profile</h1>} />
            </Route>
            {/*Những đường dẫn mà phải đăng nhập được kiểm tra tại đây */}
          </Route>
          {/* --- NHÓM 2: MEMBER (Đích đến) --- */}
          {/* Cần khai báo route này thì Navigate to="/dashboard" mới chạy được */}
          <Route path="/dashboard" element={<MemberLayout showLoginNotice={false} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;