import { useState, useEffect } from 'react';
import './list_recipe.css';
import { useAuth } from '../../../contexts/Authen';

export default function RecipeManagement(){
  const [recipes, setRecipes] = useState(null);
  const [page, setPage] = useState(1);
  const [regionId, setRegionId] = useState('');
  const [eventId, setEventId] = useState('');
  const {api, renderDate, store} = useAuth();
  useEffect(() => {
    // Gọi API lấy danh sách question theo page
    fetch(`${api}recipes?page=${page}`)
      .then(res => res.json())
      .then(res => {
        setRecipes(res.data);
      });
  }, [page, api]);

  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-pending status-pending ">Chờ duyệt</span>;
      case 'approved':
        return <span className="badge badge-approved status-approved">Đã duyệt</span>;
      case 'rejected':
        return <span className="badge badge-rejected status-rejected">Từ chối</span>;
      default:
        return <span className="status-badge">Không có</span>;
    }
  };

    const renderEvent = (event) => {
    switch (event) {
      case 'Tết Nguyên Đán':
        return <span className="event-badge event-tet">Tết Nguyên Đán</span>;

      case 'Giáng sinh':
        return <span className="event-badge event-christmas">Giáng sinh</span>;

      case 'Sinh nhật':
        return <span className="event-badge event-birthday">Sinh nhật</span>;

      case 'Tiệc BBQ':
        return <span className="event-badge event-bbq">Tiệc BBQ</span>;

      default:
        return <span className="event-badge">Không có</span>;
    }
  };

  const renderRegion = (regionName) => {
    switch (regionName) {
      case 'Miền Bắc':
        return (
          <span className="region-badge region-north">
            Miền Bắc
          </span>
        );

      case 'Miền Trung':
        return (
          <span className="region-badge region-central">
            Miền Trung
          </span>
        );

      case 'Miền Nam':
        return (
          <span className="region-badge region-south">
            Miền Nam
          </span>
        );

      default:
        return (
          <span className="region-badge">
            Không có
          </span>
        );
    }
  };

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
    <div className="recipe-management-container">

      {/* Title */}
      <div className="recipe-page-title">
        <h1>Quản Lý Công Thức</h1>
        <span>Tổng cộng {recipes.total} công thức</span>
      </div>

      {/* Filter Section */}
      <div className="filter-section active">
        <div className="filter-row">
          <div className="filter-group">
            <label>Vùng miền</label>
            <select>
              <option value="all">Tất cả</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sự kiện</label>
            <select>
              <option value="all">Tất cả</option>
              <option value="Tết Nguyên Đán">Tết Nguyên Đán</option>
              <option value="Giáng sinh">Giáng sinh</option>
              <option value="Sinh nhật">Sinh nhật</option>
              <option value="Tiệc BBQ">Tiệc BBQ</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ngày đăng từ</label>
            <input type="date"/>
          </div>
        </div>

        <div className="filter-buttons">
          <button className="filter-btn btn-primary" >
            Áp dụng
          </button>
          <button className="filter-btn btn-secondary" >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="recipes-table-container">
        <div class="table-header">
          <h3 class="table-title">Tất cả công thức</h3>
        </div>
        <table className="recipes-table">
          <thead>
            <tr>
              <th>Công thức</th>
              <th>Vùng miền</th>
              <th>Sự kiện</th>
              <th>Trạng thái</th>
              <th>Ngày đăng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {recipes.data.map(recipe => (
              <tr key={recipe.id}>
                <td>
                  <div className="recipe-info-cell">
                    <img src={`${store}${recipe.image_path}` ?? "/placeholder.png"} className="recipe-image" />
                    <div>
                      <h4>{recipe.title}</h4>
                      <p>Độ khó: {recipe.difficulty.name}</p>
                    </div>
                  </div>
                </td>
                <td>{renderRegion(recipe.region?.name)}</td>
                <td>{renderEvent(recipe.event?.name)}</td>
                 <td>{renderStatus(recipe.status)}</td>
                <td>{renderDate(recipe.created_at)}</td>
                <td>
                  <button class="table-action-btn table-btn-view">
                    <i className="fas fa-eye"></i>
                    Xem
                  </button>
                  <button class="table-action-btn table-btn-delete">
                    <i className="fas fa-trash"></i>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
    {/* Previous */}
    <button
      className="pagination-btn"
      disabled={recipes.current_page === 1}
      onClick={() => setPage(recipes.current_page - 1)}
    >
      Trước
    </button>

    {/* Pages */}
    {Array.from(
      { length: recipes.last_page },
      (_, i) => i + 1
    ).map(p => (
      <button
        key={p}
        className={`pagination-btn ${
          p === recipes.current_page ? 'active' : ''
        }`}
        onClick={() => setPage(p)}
      >
        {p}
      </button>
    ))}

    {/* Next */}
    <button
      className="pagination-btn"
      disabled={recipes.current_page === recipes.last_page}
      onClick={() => setPage(recipes.current_page + 1)}
    >
      Tiếp
    </button>
  </div>
      </div>
    </div>
  );
};