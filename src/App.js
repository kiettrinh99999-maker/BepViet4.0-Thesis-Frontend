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
import BlogPage from './pages/blogs/list_blog';
import ReportBody from './pages/admin/ManageReports/report';
import RecipeManagement from './pages/admin/ManageRecipes/list_recipe';
import RecipeDetail from './pages/recipes/detail_recipe';
import CategoryManagement from './pages/admin/ManageCategories/magage_category';
import Register from './pages/register';
import Login from './pages/login';
import AdminLogin from './pages/admin/AdminLogin';
import RecipeUpdate from './pages/recipes/update_recipe';
import HomePage from './pages/home/HomePage';
import CreateBlog from './pages/blogs/add_blog';
import ManageUser from './pages/admin/ManageAccounts/manage_users';
import RecipeDetailReport from './pages/recipes/detail_recipe_report';
import RecipeApproval from './pages/admin/ManageRecipes/approve_recipe';
import RecipeDuyet from './pages/recipes/duyet';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- NHÓM 1: GUEST --- */}
          <Route ute element={<GuestRoute><GuestLayout /><MemberLayout /></GuestRoute>}>
            {/* PHẢI CÓ ROUTE CON Ở ĐÂY */}
            <Route path="/" element={<HomePage/>} />
            <Route path="/cong-thuc" element={<ListRecipe />} />
            <Route path="/cong-thuc/:key" element={<RecipeDetail />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/dien-dan" element={<ForumPage />} />
            <Route path="/dien-dan/cau-hoi/:id" element={<ForumDetailPage />} />
            
            {/*Những đường dẫn mà phải đăng nhập được kiểm tra */}
            <Route element={<RouterProtected />}>
              <Route path="/shopping-list" element={<ShoppingList />} />
              <Route path="/meal-plan" element={<MealPlan />} />
              <Route path="/profile" element={<ProfileBody />} />
              <Route path="/tao-cong-thuc" element={<CreateRecipe />} />
            <Route path="/cong-thuc/edit/:slug" element={<RecipeUpdate/>} />
             
              <Route path="/tao-blog" element={<CreateBlog />} />
          
            </Route>
            {/*Những đường dẫn mà phải đăng nhập được kiểm tra*/}
          </Route>
          <Route path="/login" element={<Login/>} />
          
          <Route path="/admin/login" element={<AdminLogin/>} />

          <Route path="/register" element={<Register/>} />
          {/* --- NHÓM 2: ADMIN (Đích đến) ------ */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardBody />} />
            <Route path="config" element={<ConfigBody />} />
            <Route path="report" element={<ReportBody />} />
            <Route path="approve/:id" element={< RecipeDuyet />} />

            <Route path="cong-thuc" element={<RecipeManagement />} />
           
            <Route path="report/:id" element={<RecipeDetailReport/>} />
            <Route path="approve" element={<RecipeApproval/>} />
            <Route path="categories" element={<CategoryManagement/>} />
            <Route path="manageuser" element={<ManageUser/>} />
          </Route>
          <Route path="*" element={<div className="text-center mt-5">404 - Trang không tồn tại</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;