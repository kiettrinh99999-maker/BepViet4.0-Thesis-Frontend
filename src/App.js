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
import ListRecipe from './pages/recipes/list_recipe';
import MealPlan from './pages/mealplanes/mealplane';
import CreateRecipe from './pages/recipes/add_recipe';
import DashboardBody from './pages/admin/ManageDashboard/dashboard';
import ConfigBody from './pages/admin/ManageAdmin/config';
import ProfileBody from './pages/profiles/profile';

import ReportContent from './pages/admin/ManageReports/report';
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
            <Route path="/dien-dan/cau-hoi/:id" element={<ForumDetailPage />} />
            <Route path="/blog" element={<h1>Cài trang blog tại đây</h1>} />
            {/*Những đường dẫn mà phải đăng nhập được kiểm tra */}
            <Route element={<RouterProtected />}>
              <Route path="/shopping-list" element={<ShoppingList/>} />
              <Route path="/meal-plan" element={<MealPlan/>} />
              <Route path="/profile" element={<ProfileBody/>} />
              <Route path="/tao-cong-thuc" element={<CreateRecipe/>} />
            </Route>
            {/*Những đường dẫn mà phải đăng nhập được kiểm tra*/}
          </Route>
          <Route path="/login" element={<div>Trang Login</div>} />
          <Route path="/register" element={<div>Trang Đăng ký</div>} />
          {/* --- NHÓM 2: ADMIN (Đích đến) ------ */}
          <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<DashboardBody/>} />
            <Route path="config" element={<ConfigBody/>} />
            <Route path="report" element={<ReportContent/>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;