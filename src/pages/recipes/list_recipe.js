import { PlusCircle, ChevronLeft, ChevronRight, Filter as FilterIcon, ArrowCounterclockwise } from 'react-bootstrap-icons';
import FoodCard from '../../components/Recipe/FoodCard';
import './recipe.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/Authen';

const ListRecipe = () => {
  // --- Dữ liệu giả (Mock Data) ---
  const recipes = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
      tag: "MIỀN NAM",
      title: "Cơm tấm sườn nướng mật ong",
      description: "Cơm tấm với sườn nướng mật ong thơm ngon, trứng ốp la...",
      time: "1h 15p",
      level: "Dễ",
      reviewCount: "30581"
    },
    {
      id: 2,
      image: "https://static.vinwonders.com/production/pho-bo-ha-noi-1.jpg",
      tag: "HÀ NỘI",
      title: "Phở bò tái nạm gia truyền",
      description: "Nước dùng ngọt thanh từ xương hầm 24h, bánh phở tươi...",
      time: "2h 30p",
      level: "TB",
      reviewCount: "12400"
    },
    {
      id: 3,
      image: "https://cdn.tgdd.vn/2020/05/CookProduct/1200-1200x676-46.jpg",
      tag: "MIỀN TÂY",
      title: "Bánh xèo miền Tây giòn rụm",
      description: "Vỏ bánh vàng ươm giòn rụm, nhân tôm thịt đầy đặn...",
      time: "45p",
      level: "Dễ",
      reviewCount: "8200"
    },
    // Thêm các món khác nếu cần...
  ];

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
          {recipes.map((item) => (
            <div className="col" key={item.id}>
              <FoodCard 
                image={item.image}
                tag={item.tag}
                title={item.title}
                description={item.description}
                time={item.time}
                level={item.level}
                reviewCount={item.reviewCount}
              />
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