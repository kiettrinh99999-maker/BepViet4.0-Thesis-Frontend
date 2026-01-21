import { useState, useEffect } from "react";
import { useAuth } from "../contexts/Authen";
import { Outlet, useNavigate, useLocation } from "react-router";

export default function AdminLayout() {
  // const [activeMenu, setActiveMenu] = useState("recipes");
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);
  const [config, setConfig] = useState(null);
  const { api } = useAuth();
  const navigate = useNavigate();

  // Danh sách items sidebar
  // path: sẽ dùng cho điều hướng khi bật navigate
  const menus = [
    { id: "dashboard", icon: "fa-chart-bar", label: "Dashboard", path: "/admin/" },
    { id: "approve", icon: "fa-clipboard-check", label: "Duyệt công thức", path: "/admin/approve" },
    { id: "recipes", icon: "fa-utensils", label: "Quản lý công thức", path: "/admin/cong-thuc" },
    { id: "categories", icon: "fa-list", label: "Quản lý danh mục", path: "/admin/categories" },
    { id: "settings", icon: "fa-cog", label: "Cấu hình website", path: "/admin/config" },
    { id: "report", icon: "fa-flag", label: "Report", path: "/admin/report" },
  ];

    useEffect(() => {
    // Gọi API lấy setting web
      fetch(api + "config-active")
        .then(res => res.json())
        .then(res => {
          setConfig(res.data);
        });
    }, [api]);
  if (config === null) {
    return <h4 className="text-center mt-5">Đang tải...</h4>;
  }
  // function handleClick(menu){
  //   // setActiveMenu(menu.id);
  //   navigate(menu.path);// dùng để thay đổi đường dẫn
  //   // alert(`Bạn đang ở trang: ${menu.label}`); //thông báo giả, nên xóa khi đã có đường dẫn
  // };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        {/* Sidebar chỉ hiển thị khi showSidebar = true */}
        {showSidebar && (
        <aside
            className="col-12 col-lg-2 text-white p-0"
            style={{ backgroundColor: "#2c3e50", minHeight: "100vh"}}
        >
            <div className="text-center py-4 border-bottom border-secondary">
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <img
                      src={config.image_path}
                      alt="Logo"
                      style={{ width: 40, height: 40 }}
                    />
                    <h4 className="mb-0 fw-bold">
                      {config.name}
                    </h4>
                </div>
            </div>
            <ul className="nav flex-column mt-3">
            {/* Danh sách menu */}
            {menus.map(menu => (
              <li
                key={menu.id}
                className={`nav-link d-flex align-items-center px-4 py-3 fs-6 ${
                  location.pathname === menu.path ||
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

        {/* Right container */}
        <div className={showSidebar ? "col-lg-10 col-12 p-0 d-flex flex-column" : "col-12 p-0 d-flex flex-column"}>
        
          {/* Main content */}
          <main className="flex-grow-1">
            {/* Header */}
            <nav className="navbar navbar-light bg-white shadow-sm px-3">
              {/* Nút toggle sidebar*/}
              <button
                  className="btn btn-outline-secondary d-lg-none"
                  onClick={() => setShowSidebar(!showSidebar)}
              >
                <i className="fas fa-bars"></i>
              </button>

              <form className="d-flex ms-3" >
                  <input className="form-control" type="search" placeholder="Tìm kiếm..." />
                  <button className="btn btn-outline-white" type="submit">
                      <i className="fas fa-search"></i>
                  </button>
              </form>
              
              {/* Thông tin admin */}
              <div className="d-flex align-items-center ms-auto">
                  <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Admin"
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                  />
                  <div className="d-none d-md-block">
                  <strong>Nguyễn Văn Admin</strong>
                  <div className="text-muted small">Quản trị viên</div>
                  </div>
              </div>
            </nav>

            {/* Page content */}
            {/* Nội dung sẽ render ở đây */}
            <section className="p-4">
                <Outlet />
            </section>
          </main>

          {/* Footer */}
          <footer className="text-center py-3 border-top text-secondary small bg-white">
              {config.copyright}
          </footer>

        </div>

      </div>
    </div>
  );
};

