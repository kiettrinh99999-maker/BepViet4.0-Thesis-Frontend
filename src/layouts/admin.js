import { useState, useEffect } from "react";
import { useAuth } from "../contexts/Authen";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router";

export default function AdminLayout() {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);
  const { config, api, store, user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Danh sách items sidebar
  const menus = [
    { id: "dashboard", icon: "fa-chart-bar", label: "Dashboard", path: "/admin/" },
    { id: "approve", icon: "fa-clipboard-check", label: "Duyệt công thức", path: "/admin/approve" },
    { id: "recipes", icon: "fa-utensils", label: "Quản lý công thức", path: "/admin/cong-thuc" },
    { id: "categories", icon: "fa-list", label: "Quản lý danh mục", path: "/admin/categories" },
    { id: "settings", icon: "fa-cog", label: "Cấu hình website", path: "/admin/config" },
    { id: "report", icon: "fa-flag", label: "Report", path: "/admin/report" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Kiểm tra user có tồn tại không
  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  // Kiểm tra user có quyền admin không
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (!config?.data?.data?.length) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  const data_config = config.data.data[0];
  const imageUrl = store + data_config.image_path;

  // Sửa phần avatar - kiểm tra user.profile
  const avatarSrc = user?.profile?.image_path 
    ? store + user.profile.image_path 
    : '/avatar-default.jpg';

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {showSidebar && (
          <aside
            className="col-12 col-lg-2 text-white p-0 position-fixed top-0 start-0"
            style={{
              backgroundColor: "#2c3e50",
              height: "100vh",
              width: "16.666667%",
              zIndex: 1000
            }}
          >
            <div className="text-center py-4 border-bottom border-secondary">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <img
                  src={imageUrl}
                  alt="Logo"
                  style={{ width: 40, height: 40 }}
                />
                <h4 className="mb-0 fw-bold">
                  {data_config.name}
                </h4>
              </div>
            </div>
            <ul className="nav flex-column mt-3">
              {menus.map(menu => (
                <li
                  key={menu.id}
                  className={`nav-link d-flex align-items-center px-4 py-3 fs-6 ${location.pathname === menu.path ||
                    location.pathname.startsWith(menu.path + "/")
                    ? "bg-light text-dark border-start border-4 border-danger fw-semibold"
                    : "text-white"
                    }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(menu.path)}
                >
                  <i className={`fas ${menu.icon} fs-5 me-4`}></i>
                  <span>{menu.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div
          className={showSidebar ? "col-lg-10 col-12 p-0 d-flex flex-column" : "col-12 p-0"}
          style={{ marginLeft: showSidebar ? "16.666667%" : "0" }}
        >
          <main className="flex-grow-1">
            <nav className="navbar navbar-light bg-white shadow-sm px-3">
              <button
                className="btn btn-outline-secondary d-lg-none"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <i className="fas fa-bars"></i>
              </button>

              <form className="d-flex ms-3">
                <input className="form-control" type="search" placeholder="Tìm kiếm..." />
                <button className="btn btn-outline-white" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </form>

              <div
                className="d-flex align-items-center ms-auto position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={avatarSrc}
                  alt="avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                    marginRight: "10px"
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar-default.jpg";
                  }}
                />

                <div className="d-none d-md-block">
                  <strong>{user?.username || 'Admin'}</strong>
                  <div className="text-muted small">Quản trị viên <i className="fas fa-caret-down ms-1"></i></div>
                </div>

                {showDropdown && (
                  <div
                    className="position-absolute bg-white shadow rounded border"
                    style={{
                      top: "120%",
                      right: 0,
                      width: "200px",
                      zIndex: 1050
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 border-bottom">
                      <p className="mb-0 fw-bold text-truncate">{user?.username || 'Admin'}</p>
                      <small className="text-muted">Admin</small>
                    </div>
                    <button
                      className="btn btn-light w-100 text-start rounded-0 text-danger p-3"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </nav>

            <section className="p-4">
              <Outlet />
            </section>
          </main>

          <footer className="text-center py-3 border-top text-secondary small bg-white">
            {config.copyright}
          </footer>
        </div>
      </div>
    </div>
  );
};