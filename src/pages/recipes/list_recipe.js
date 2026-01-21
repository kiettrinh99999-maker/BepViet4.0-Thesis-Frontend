import { PlusCircle, ChevronLeft, ChevronRight, Filter as FilterIcon, ArrowCounterclockwise } from 'react-bootstrap-icons';
import FoodCard from '../../components/Recipe/FoodCard';
import './recipe.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/Authen';

const ListRecipe = () => {
  const navigate = useNavigate();
  const { user, api, store } = useAuth();

  const [recipes, setRecipes] = useState(null);

  // 1. Thêm State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [regions, setRegion] = useState('');
  const [events, setEvent] = useState('');
  const [difficult, setDiff] = useState('');
  const [regions_data, setRegionData] = useState(null);
  const [events_data, setEventData] = useState(null);
  const [difficult_data, setDiffData] = useState(null);
  useEffect(() => {
    fetch(api + 'get-event-region') // Đảm bảo đúng đường dẫn API bạn đặt trong Laravel
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          console.log("Dữ liệu API:", res.data);
          setRegionData(res.data.regions || []);
          setEventData(res.data.events || []);
          setDiffData(res.data.difficulties || []);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  //Lấy dữ liệu recipe
  useEffect(() => {
    // URL cơ bản
    let url = `${api}recipes?page=${currentPage}`;

    // Lọc theo Vùng miền (nếu có chọn và khác rỗng)
    if (regions && regions !== "") {
      url += `&region_id=${regions}`;
    }

    // Lọc theo Sự kiện
    if (events && events !== "") {
      url += `&event_id=${events}`;
    }

    // Lọc theo Độ khó
    if (difficult && difficult !== "") {
      url += `&difficulty_id=${difficult}`;
    }

    // Mock user region (nếu logic dự án yêu cầu ưu tiên cái này thì giữ, không thì có thể bỏ nếu xung đột với filter)
    if (user && user.region_id && !regions) {
      // Chỉ dùng user region mặc định nếu người dùng CHƯA chọn filter vùng miền nào
      url += `&mock_user_region=${user.region_id}`;
    }
    console.log("Fetching URL:", url); // Log ra để kiểm tra link đúng không
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setRecipes(res.data.data || []);
          setCurrentPage(res.data.current_page);
          setTotalPages(res.data.last_page);
        } else {
          setRecipes([]);
        }
      })
      .catch(err => {
        console.log("Lỗi fetch:", err);
        setRecipes([]);
      });

  }, [user, api, currentPage, regions, events, difficult]);

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Cuộn lên đầu trang cho mượt
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  // Hàm đặt lại bộ lọc
  const handleResetFilter = () => {
    setRegion("");    // Xóa chọn vùng
    setEvent("");     // Xóa chọn dịp
    setDiff("");      // Xóa chọn độ khó
    setCurrentPage(1); // Quay về trang 1
  };
  // Hàm đặt lại bộ lọc
  const handleReset = () => {
    setEvent("");     // Xóa chọn dịp
    setDiff("");      // Xóa chọn độ khó
  };

  if (!recipes) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="list-recipe-page">
      {/* --- PHẦN 1: HERO SECTION --- */}
      <section className="hero">
        <div className="container">
          <h1>Công Thức Ẩm Thực Việt</h1>
          <p>Khám phá hơn 500+ công thức nấu ăn đặc sắc từ ba miền Bắc - Trung - Nam</p>
          <div className="hero-tagline">
            {regions_data && regions_data.map((item) => (
              <span
                key={item.id}
                onClick={() => {
                  setRegion(item.id);
                }}
                className={regions === item.id ? "active-region" : ""}
                style={{ cursor: "pointer", marginRight: "15px" }} // CSS nhanh để dễ nhìn
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- PHẦN 2: NÚT THÊM MÓN --- */}
      <section className="add-recipe-section">
        <div className="container">
          <button className="btn-add-recipe" onClick={() => navigate("/tao-cong-thuc")}>
            <PlusCircle size={18} /> Thêm Công Thức Mới
          </button>
        </div>
      </section>

      <div className="container">
        {/* --- PHẦN 3: BỘ LỌC (Giữ nguyên) --- */}
        <section className="filter-section px-4">
          <div className="filter-container">
            {/* ... (Giữ nguyên code bộ lọc của bạn ở đây) ... */}
            {/* Để gọn code tôi ẩn phần này đi, bạn giữ nguyên code cũ nhé */}
            {/* --- 1. KHU VỰC --- */}
            <div className="filter-group">
              <label className="filter-label">Khu vực</label>
              <select
                className="filter-select"
                // QUAN TRỌNG: Thêm dòng này để React điều khiển giá trị hiển thị
                value={regions}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {/* Giá trị value="" này khớp với state khi reset */}
                <option value="">Tất cả miền</option>
                {regions_data && regions_data.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* --- 2. DỊP ĐẶC BIỆT --- */}
            <div className="filter-group">
              <label className="filter-label">Dịp đặc biệt</label>
              <select
                className="filter-select"
                // QUAN TRỌNG: Thêm value={events}
                value={events}
                onChange={(e) => {
                  setEvent(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả các dịp</option>
                {events_data && events_data.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* --- 3. ĐỘ KHÓ --- */}
            <div className="filter-group">
              <label className="filter-label">Độ khó</label>
              <select
                className="filter-select"
                // QUAN TRỌNG: Thêm value={difficult}
                value={difficult}
                onChange={(e) => {
                  setDiff(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả độ khó</option>
                {difficult_data && difficult_data.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-buttons">
              {/* <button className="filter-btn apply"><FilterIcon className="me-1" /> Lọc</button> */}
              <button
                className="filter-btn reset"
                onClick={handleResetFilter}
                style={{ marginLeft: '10px', backgroundColor: '#6c757d', color: 'white' }} // Style nhanh hoặc dùng CSS bên dưới
              >
                <ArrowCounterclockwise className="me-1" /> Đặt lại
              </button></div>
          </div>
        </section>

        {/* --- PHẦN 4: DANH SÁCH MÓN ĂN --- */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          {recipes.length > 0 ? (
            recipes.map((item) => (
              <div className="col" key={item.id}>
                <FoodCard
                  image={`${store}${item.image_path}`}
                  tag={item.region ? item.region.name : 'Việt Nam'}
                  title={item.title}
                  description={item.description}
                  time={`${item.cooking_time} phút`}
                  level={item.difficulty ? item.difficulty.name : 'Trung bình'}
                  rating={item.rates_avg_score ? parseFloat(item.rates_avg_score).toFixed(1) : 0}
                  reviewCount={item.rates_count || 0}
                  onClick={() => navigate(`/cong-thuc/${item.title_slug || item.id}`)}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p>Chưa có công thức nào.</p>
            </div>
          )}
        </div>

        {/* --- PHẦN 5: PHÂN TRANG (ĐÃ SỬA) --- */}
        {totalPages >= 1 && (
          <div className="pagination-container">
            {/* Nút Previous */}
            <button
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>

            {/* Render các số trang */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Nút Next */}
            <button
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ListRecipe;