import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PlusCircle, Funnel, ChevronLeft, ChevronRight, Filter as FilterIcon, ArrowCounterclockwise } from 'react-bootstrap-icons';
import FoodCard from '../../components/Recipe/FoodCard';
import './recipe.css'
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
            <span>Miền Bắc</span>
            <span>Miền Trung</span>
            <span>Miền Nam</span>
          </div>
        </div>
      </section>

      {/* --- PHẦN 2: NÚT THÊM MÓN --- */}
      <section className="add-recipe-section">
        <div className="container">
          <button className="btn-add-recipe">
            <PlusCircle size={18} /> Thêm Công Thức Mới
          </button>
        </div>
      </section>

      <div className="container">
        {/* --- PHẦN 3: BỘ LỌC (FILTER) --- */}
        <section className="filter-section px-4">
          <div className="filter-container">
            
            {/* Nhóm lọc: Khu vực */}
            <div className="filter-group">
              <label className="filter-label">Khu vực</label>
              <select className="filter-select">
                <option value="all">Tất cả miền</option>
                <option value="bac">Miền Bắc</option>
                <option value="trung">Miền Trung</option>
                <option value="nam">Miền Nam</option>
              </select>
            </div>

            {/* Nhóm lọc: Phân loại */}
            <div className="filter-group">
              <label className="filter-label">Phân loại</label>
              <select className="filter-select">
                <option value="all">Tất cả loại món</option>
                <option value="sang">Ăn sáng</option>
                <option value="chinh">Món chính</option>
                <option value="vat">Ăn vặt</option>
              </select>
            </div>

            {/* Nhóm lọc: Độ khó */}
            <div className="filter-group">
              <label className="filter-label">Độ khó</label>
              <select className="filter-select">
                <option value="all">Tất cả</option>
                <option value="de">Dễ</option>
                <option value="tb">Trung bình</option>
                <option value="kho">Khó</option>
              </select>
            </div>

            {/* Nhóm lọc: Sắp xếp */}
            <div className="filter-group">
              <label className="filter-label">Sắp xếp</label>
              <select className="filter-select">
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="time">Thời gian nấu</option>
              </select>
            </div>

            {/* Nút bấm */}
            <div className="filter-buttons">
              <button className="filter-btn apply">
                <FilterIcon className="me-1"/> Lọc
              </button>
              <button className="filter-btn reset">
                <ArrowCounterclockwise className="me-1"/> Đặt lại
              </button>
            </div>

          </div>
        </section>

        {/* --- PHẦN 4: DANH SÁCH MÓN ĂN (GRID) --- */}
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
          ))}
        </div>

        {/* --- PHẦN 5: PHÂN TRANG (PAGINATION) --- */}
        <div className="pagination-container">
          <button className="pagination-btn disabled">
            <ChevronLeft />
          </button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <span className="d-flex align-items-center px-2 text-secondary">...</span>
          <button className="pagination-btn">12</button>
          <button className="pagination-btn">
            <ChevronRight />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ListRecipe;