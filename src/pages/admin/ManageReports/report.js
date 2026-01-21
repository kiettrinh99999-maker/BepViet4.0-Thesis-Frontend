import React, { useEffect, useState } from 'react';
import './Report.css';
import { useAuth } from "../../../contexts/Authen";

const ReportBody = () => {
  // 1. STATE MANAGEMENT
  const [recipesReport, setRecipesReport] = useState([]); // Dữ liệu báo cáo
  const [loading, setLoading] = useState(true);           // Trạng thái loading

  // State cho bộ lọc
  const [filters, setFilters] = useState({
    status: 'all',
    date: ''
  });

  // State cho phân trang
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const { api, renderDate } = useAuth();
  const renderStatus = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-pending">Chờ xử lý</span>;
      case 'reviewed': return <span className="badge badge-reviewed">Đã xử lý</span>;
      case 'dismissed': return <span className="badge badge-dismissed">Đã bỏ qua</span>;
      default: return null;
    }
  };
  useEffect(() => {
    setLoading(true);
    let queryUrl = `${api}admin/report?page=${page}`;
    if (filters.status && filters.status !== 'all') {
      queryUrl += `&status=${filters.status}`;
    }
    if (filters.date) {
      queryUrl += `&created_at=${filters.date}`;
    }
    fetch(queryUrl)
      .then(res => res.json())
      .then(res => {
        if (res.success || res.data) {
          const result = res.data;
          setRecipesReport(result.data);
          setPagination({
            current_page: result.current_page,
            last_page: result.last_page,
            total: result.total
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải báo cáo:", err);
        setLoading(false);
      });
  }, [page, filters.status, filters.date, api]);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleResetFilter = () => {
    setFilters({ status: 'all', date: '' });
    setPage(1);
  };

  if (loading) {
    return <div className="loading-container"><h3>Đang tải dữ liệu...</h3></div>;
  }

  return (
    <div className="report-main-content">

      {/* Header */}
      <div className="page-header-content">
        <div className="page-title">
          <h2>Quản Lý Báo Cáo Vi Phạm</h2>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-box">
        <div className="filter-row">
          <div className="filter-item">
            <label>Trạng thái</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="reviewed">Đã xem xét</option>
              <option value="dismissed">Đã bỏ qua</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Ngày báo cáo</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-actions">
            {/* Nút reset filter */}
            <button className="btn-filter btn-reset" onClick={handleResetFilter} title="Làm mới bộ lọc">
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Công thức</th>
                <th style={{ width: '15%' }}>Người báo cáo</th>
                <th style={{ width: '20%' }}>Lý do</th>
                <th style={{ width: '10%' }}>Ngày</th>
                <th style={{ width: '15%' }}>Tác giả bài viết</th>
                <th style={{ width: '10%' }}>Trạng thái</th>
                <th style={{ width: '5%' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recipesReport.length > 0 ? (
                recipesReport.map((item) => (
                  <tr key={item.id}>
                    {/* Cột Công Thức */}
                    <td>
                      <div className="info-group">
                        <img
                          src={item.recipe?.image_path || '/default-recipe.jpg'}
                          alt="Recipe"
                          className="info-img"
                          onError={(e) => e.target.src = 'https://placehold.co/100'}
                        />
                        <div className="info-text">
                          <h4>{item.recipe?.title}</h4>
                          <p>{item.recipe?.difficulty?.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Cột Người Báo Cáo */}
                    <td>
                      <div className="user-group">
                        <img
                          src={item.user?.profile?.image_path || 'https://placehold.co/50'}
                          alt="User"
                          className="user-avatar"
                        />
                        <span className="user-name">{item.user?.profile?.name || 'Ẩn danh'}</span>
                      </div>
                    </td>

                    {/* Cột Lý Do */}
                    <td>
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{item.content}</p>
                    </td>

                    {/* Cột Ngày (Logic mới tạo) */}
                    <td>{renderDate(item.created_at)}</td>

                    {/* Cột Tác Giả (Chủ công thức) */}
                    <td>
                      <div className="user-group">
                        <img
                          src={item.recipe?.user?.profile?.image_path || 'https://placehold.co/50'}
                          alt="Author"
                          className="user-avatar"
                        />
                        <span className="user-name">{item.recipe?.user?.profile?.name || 'Ẩn danh'}</span>
                      </div>
                    </td>

                    {/* Cột Trạng Thái */}
                    <td>{renderStatus(item.status)}</td>

                    {/* Cột Thao Tác */}
                    <td>
                      <div className="action-group">
                        <button className="btn-icon btn-view" title="Xem chi tiết">
                          <i className="fas fa-eye"></i>
                        </button>
                        {item.status === 'pending' && (
                          <>
                            <button className="btn-icon btn-check" title="Xác nhận vi phạm">
                              <i className="fas fa-check"></i>
                            </button>
                            <button className="btn-icon btn-trash" title="Bỏ qua báo cáo">
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    Không có báo cáo nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Section */}
        {pagination.last_page >= 1 && (
          <div className="pagination-container">
            <div className="pagination">
              <button
                className="page-link"
                disabled={pagination.current_page === 1}
                onClick={() => handlePageChange(pagination.current_page - 1)}
              >
                Trước
              </button>

              {/* Tạo mảng số trang */}
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`page-link ${pageNum === pagination.current_page ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="page-link"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => handlePageChange(pagination.current_page + 1)}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportBody;