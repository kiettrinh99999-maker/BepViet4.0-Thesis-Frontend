import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/Authen";

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState(null);
  const [page, setPage] = useState(1);
  const {api} = useAuth();
  useEffect(() => {
    // Gọi API lấy danh sách question theo page
    fetch(`${api}recipes?page=${page}`)
      .then(res => res.json())
      .then(res => {
        setRecipes(res.data);
      });
  }, [page, api]);

  function handleView(id){
    console.log("Xem ID:", id);
  };

  function handleDelete(id){
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    console.log("Xóa ID:", id);
  };

  //Nếu chưa fetch xong sẽ hiển thị thông báo đang tải
  if (recipes === null) {
    return <h4 className="text-center mt-5">Đang tải...</h4>;
  }
  return (
    <div className="container-fluid">
      {/* Title */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">Quản lý công thức</h1>
          <span className="text-muted">Tổng cộng {recipes.total} công thức</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            {/* Region */}
            <div className="col-md-4 col-sm-6">
              <label className="form-label fw-medium text-muted">
                Vùng miền
              </label>
              <select className="form-select py-2">
                <option>Tất cả vùng miền</option>
                <option>Miền Bắc</option>
                <option>Miền Trung</option>
                <option>Miền Nam</option>
              </select>
            </div>

            {/* Event */}
            <div className="col-md-4 col-sm-6">
              <label className="form-label fw-medium text-muted">
                Sự kiện
              </label>
              <select className="form-select py-2">
                <option>Tất cả sự kiện</option>
                <option>Tết</option>
                <option>Trung thu</option>
                <option>Ngày thường</option>
              </select>
            </div>

            {/* Date */}
            <div className="col-md-4 col-sm-6">
              <label className="form-label fw-medium text-muted">
                Ngày đăng từ
              </label>
              <input type="date" className="form-control py-2" />
            </div>
          </div>


          {/* Buttons */}
          <div className="d-flex gap-2 mt-4">
          <button className="btn btn-danger text-white px-4">
              Áp dụng bộ lọc
          </button>
          <button className="btn btn-outline-dark px-4">
              Đặt lại
          </button>
          </div>
        </div>
      </div>


      {/* Table */}
      <div className="card shadow-sm rounded-3">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Danh sách công thức</h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-borderless mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 text-center">Công thức</th>
                <th className="py-3 text-center">Vùng miền</th>
                <th className="py-3 text-center">Sự kiện</th>
                <th className="py-3 text-center">Trạng thái</th>
                <th className="py-3 text-center">Ngày đăng</th>
                <th className="py-3 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="align-middle">
        {recipes.data.map((recipe) => (
          <tr key={recipe.id}>
            <td>
              <div className="d-flex align-items-center gap-3">
                <img
                  src={recipe.image_path}
                  alt={recipe.title}
                  className="rounded"
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />

                <div>
                  <div className="fw-medium">{recipe.title}</div>
                  <small className="text-muted">
                    Độ khó: {recipe.difficulty?.name}
                  </small>
                </div>
              </div>
            </td>

            <td className="text-center">
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 fs-6">
                {recipe.region.name}
              </span>
            </td>

            <td className="text-center">
              <span className="badge rounded-pill bg-secondary text-dark px-3 py-2 fs-6">
                {recipe.event?.name ?? '—'}
              </span>
            </td>

            <td className="text-center">
              <span className="badge rounded-pill bg-success text-dark px-3 py-2 fs-6">
                {recipe.status}
              </span>
            </td>

            <td className="text-center">
              {new Date(recipe.created_at).toLocaleDateString('vi-VN')}
            </td>

            <td className="text-center">
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-outline-secondary btn-sm px-4" onClick={() => handleView(recipe.id)}>
                  <i className="fas fa-eye me-2"></i>
                  Xem
                </button>
                <button className="btn btn-outline-danger btn-sm px-4" onClick={() => handleDelete(recipe.id)}>
                  <i className="fas fa-trash me-2"></i>
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      </div>
      
      {/* Pagination */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination gap-2">

          {/* Previous */}
          <li className="page-item">
            <button
              className="btn btn-outline-danger"
              disabled={recipes.current_page === 1}
              onClick={() => setPage(recipes.current_page - 1)}
            >
              &laquo;
            </button>
          </li>

          {/* Page numbers */}
          {Array.from({ length: recipes.last_page }, (_, i) => {
            const pageNumber = i + 1;
            const isActive = recipes.current_page === pageNumber;

            return (
              <li key={pageNumber} className="page-item">
                <button
                  className={`btn ${
                    isActive ? "btn-danger text-white" : "btn-outline-danger"
                  }`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}

          {/* Next */}
          <li className="page-item">
            <button
              className="btn btn-outline-danger"
              disabled={recipes.current_page === recipes.last_page}
              onClick={() => setPage(recipes.current_page + 1)}
            >
              &raquo;
            </button>
          </li>

        </ul>
      </nav>

    </div>
  );
};

export default RecipeManagement;
