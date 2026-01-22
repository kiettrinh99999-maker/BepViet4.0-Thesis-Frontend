import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/Authen';
import './RecipeApproval.css';
import { useNavigate } from 'react-router-dom';
const RecipeApproval = () => {

  const { api, store, renderDate } = useAuth(); // Lấy base URL API và Token từ context
  const navigator = useNavigate()
  const handleStatus = async (id_, action) => {
    try {
      const response = await fetch(`${api}recipes/${id_}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: action
        })
      });
      if (response.ok) {
        alert("Xử lý thành công!");
       setIsload(!isload)
      } else {
        const errorData = await response.json();
        console.log("Lỗi từ server:", errorData);
        alert("Có lỗi xảy ra: " + (errorData.message || "Không rõ lỗi"));
      }

    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert("Lỗi kết nối đến server");
    }
  };
  // --- STATE DỮ LIỆU ---
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isload, setIsload] = useState(false);
  // State phân trang từ API Laravel
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  // State dữ liệu cho dropdown bộ lọc (lấy từ API metadata nếu có, hoặc fix cứng tạm thời)
  // Bạn có thể tận dụng lại API 'get-event-region' giống trang ListRecipe
  const [regionsData, setRegionsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [difficultiesData, setDifficultiesData] = useState([]);

  // --- STATE BỘ LỌC ---
  const [filters, setFilters] = useState({
    region_id: '',
    event_id: '',
    difficulty_id: '',
  });

  // --- EFFECT 1: LẤY METADATA CHO BỘ LỌC (Chạy 1 lần) ---
  useEffect(() => {
    const endpoint = api.endsWith('/') ? 'get-event-region' : '/get-event-region';
    fetch(api + endpoint)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setRegionsData(res.data.regions || []);
          setEventsData(res.data.events || []);
          setDifficultiesData(res.data.difficulties || []);
        }
      })
      .catch(err => console.error("Lỗi lấy metadata:", err));
  }, [api]);

  // --- EFFECT 2: LẤY DANH SÁCH CÔNG THỨC PENDING (Chạy khi filter hoặc page thay đổi) ---
  useEffect(() => {
    fetchRecipes(1); // Mặc định load trang 1 khi filter thay đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, isload]);

  const fetchRecipes = (page = 1) => {
    setLoading(true);

    // Xây dựng URL với query params
    const endpoint = api.endsWith('/') ? 'recipes/pending' : '/recipes/pending';
    const url = new URL(api + endpoint);

    url.searchParams.append('page', page);

    if (filters.region_id) url.searchParams.append('region_id', filters.region_id);
    if (filters.event_id) url.searchParams.append('event_id', filters.event_id);
    if (filters.difficulty_id) url.searchParams.append('difficulty_id', filters.difficulty_id);

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          // Laravel paginate trả về data trong res.data.data
          // Thông tin phân trang nằm ở res.data (current_page, last_page...)
          const result = res.data;
          setRecipes(result.data || []);
          setPagination({
            current_page: result.current_page,
            last_page: result.last_page,
            total: result.total
          });
        } else {
          setRecipes([]);
        }
      })
      .catch(err => {
        console.error("Lỗi fetch pending:", err);
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  };

  // --- HANDLERS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      region_id: '',
      event_id: '',
      difficulty_id: ''
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchRecipes(newPage);
    }
  };

  // Hàm xử lý duyệt/từ chối (Cần API backend tương ứng)
  const handleAction = (type, recipe) => {
    if (type === 'approve') {
      if (window.confirm(`Duyệt công thức: "${recipe.title}"?`)) {
        // Gọi API duyệt tại đây (Ví dụ: POST /recipes/{id}/approve)
        alert("Tính năng đang phát triển: Gọi API duyệt ID " + recipe.id);
      }
    } else if (type === 'reject') {
      if (window.confirm(`Từ chối công thức: "${recipe.title}"?`)) {
        // Gọi API từ chối tại đây
        alert("Tính năng đang phát triển: Gọi API từ chối ID " + recipe.id);
      }
    } else {
      // Xem chi tiết (Chuyển trang hoặc mở modal)
      window.open(`/cong-thuc/${recipe.id}-${recipe.title_slug}`, '_blank');
    }
  };
  console.log(recipes)
  return (
    <div className="recipe-approval-container">
      {/* 1. Header */}
      <div className="page-header">
        <h1>Duyệt Công Thức</h1>
        <span>Hiển thị {recipes.length} / {pagination.total} công thức cần xử lý</span>
      </div>

      {/* 2. Bộ lọc */}
      <div className="filter-section">
        <div className="filter-row">
          {/* Lọc Vùng Miền */}
          <div className="filter-group">
            <label>Vùng miền</label>
            <select name="region_id" value={filters.region_id} onChange={handleFilterChange}>
              <option value="">Tất cả vùng miền</option>
              {regionsData.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Lọc Sự kiện */}
          <div className="filter-group">
            <label>Sự kiện</label>
            <select name="event_id" value={filters.event_id} onChange={handleFilterChange}>
              <option value="">Tất cả sự kiện</option>
              {eventsData.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Lọc Độ khó */}
          <div className="filter-group">
            <label>Độ khó</label>
            <select name="difficulty_id" value={filters.difficulty_id} onChange={handleFilterChange}>
              <option value="">Tất cả độ khó</option>
              {difficultiesData.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-buttons">
          <button className="btn btn-secondary" onClick={handleResetFilters}>Đặt lại bộ lọc</button>
        </div>
      </div>

      {/* 3. Bảng dữ liệu */}
      <div className="table-container">
        <div className="table-header-title">Danh sách chờ duyệt</div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <table className="recipes-table">
            <thead>
              <tr>
                <th style={{ width: '350px' }}>Công thức</th>
                <th>Thông tin</th>
                <th>Người đăng</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recipes.length > 0 ? recipes.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="recipe-info">
                      <img
                        src={item.image_path ? `${store}${item.image_path}` : 'https://placehold.co/60'}
                        alt={item.title}
                        className="recipe-img"
                        onError={(e) => e.target.src = 'https://placehold.co/60'}
                      />
                      <div className="recipe-details">
                        <h4>{item.title}</h4>
                        <p>
                          {/* Hiển thị badge độ khó */}
                          <span className="badge" style={{ background: '#eee', color: '#333' }}>
                            {item.difficulty ? item.difficulty.name : 'Chưa rõ'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {item.region && <span className="badge region-badge">{item.region.name}</span>}
                      {item.event && <span className="badge event-badge">{item.event.name}</span>}
                    </div>
                  </td>
                  <td>
                    <strong>{item.user ? item.user.username : 'Ẩn danh'}</strong>
                  </td>
                  <td>
                    {item.cooking_time} phút<br />
                    <small style={{ color: '#888' }}>{renderDate(item.created_at)}</small>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn btn-view" onClick={() => navigator(`/admin/approve/${item.id}`)}>
                        <i className="fas fa-eye"></i> Xem
                      </button>
                      <button className="action-btn btn-approve" onClick={() => handleStatus(item.id, "active")}>
                        <i className="fas fa-check"></i> Duyệt
                      </button>
                      <button className="action-btn btn-reject" onClick={() => handleStatus(item.id, "rejected")}>
                        <i className="fas fa-times"></i> Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                    Không có công thức nào đang chờ duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* 4. Phân trang */}
        {pagination.last_page > 1 && (
          <div className="pagination">
            <button
              className={`pagination-btn ${pagination.current_page === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              Trước
            </button>

            {/* Logic hiển thị số trang đơn giản */}
            {[...Array(pagination.last_page)].map((_, idx) => (
              <button
                key={idx + 1}
                className={`pagination-btn ${pagination.current_page === idx + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className={`pagination-btn ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
            >
              Tiếp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeApproval;