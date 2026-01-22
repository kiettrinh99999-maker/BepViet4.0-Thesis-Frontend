import React from 'react';
import './HomePage.css'; // Import file CSS bên dưới

// Giả sử bạn import component của bạn ở đây:
// import RecipeCard from './RecipeCard';
// import BlogCard from './BlogCard';

// Dữ liệu mẫu (Bạn có thể xóa khi đã kết nối API)
const featuredRecipes = [
  { id: 1, title: "Cơm tấm sườn bì chả", image: "https://via.placeholder.com/300x200", time: "45p", level: "Dễ" },
  { id: 2, title: "Phở bò gia truyền", image: "https://via.placeholder.com/300x200", time: "90p", level: "Khó" },
  { id: 3, title: "Bún chả Hà Nội", image: "https://via.placeholder.com/300x200", time: "60p", level: "Trung bình" },
];

const featuredBlogs = [
  { id: 1, title: "Câu chuyện Phở Việt", excerpt: "Hành trình món phở vươn tầm thế giới...", image: "https://via.placeholder.com/300x200" },
  { id: 2, title: "Mâm cỗ ngày Tết", excerpt: "Ý nghĩa các món ăn truyền thống...", image: "https://via.placeholder.com/300x200" },
  { id: 3, title: "Gia vị vùng cao", excerpt: "Khám phá mắc khén, hạt dổi...", image: "https://via.placeholder.com/300x200" },
];

const HomePage = () => {
  return (
    <main className="homepage-content">
      
      {/* 1. HERO SECTION: Banner giới thiệu */}
      <section className="hero-section text-center d-flex align-items-center">
        <div className="container">
          <h1 className="display-4 fw-bold hero-title">Bếp Việt 4.0</h1>
          <p className="lead mb-4 hero-subtitle">Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam</p>
          
          <div className="hero-tags d-flex justify-content-center gap-3">
            <span className="badge rounded-pill">Miền Bắc</span>
            <span className="badge rounded-pill">Miền Trung</span>
            <span className="badge rounded-pill">Miền Nam</span>
          </div>
        </div>
      </section>

      {/* 2. RECIPES SECTION: Danh sách công thức */}
      <section className="container py-5">
        <div className="section-header text-center mb-5">
          <h2 className="fw-bold section-title">Công thức nổi bật</h2>
          <div className="title-divider"></div>
        </div>

        <div className="row g-4">
          {featuredRecipes.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              {/* --- Đặt Component RecipeCard của bạn vào đây --- */}
              {/* Ví dụ: <RecipeCard data={item} /> */}
              
              {/* Đây là Placeholder demo để bạn thấy giao diện */}
              <div className="card h-100 shadow-sm border-0">
                <img src={item.image} className="card-img-top" alt={item.title} />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.title}</h5>
                  <p className="text-muted small"><i className="far fa-clock"></i> {item.time} | {item.level}</p>
                </div>
              </div>
              {/* ----------------------------------------------- */}
            </div>
          ))}
        </div>
      </section>

      {/* 3. BLOG SECTION: Bài viết mới */}
      <section className="container py-5 mb-4">
        <div className="section-header text-center mb-5">
          <h2 className="fw-bold section-title">Trải Nghiệm Ẩm Thực</h2>
          <div className="title-divider"></div>
        </div>

        <div className="row g-4">
          {featuredBlogs.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              {/* --- Đặt Component BlogCard của bạn vào đây --- */}
              {/* Ví dụ: <BlogCard data={item} /> */}

              {/* Đây là Placeholder demo */}
              <div className="card h-100 shadow-sm border-0">
                <img src={item.image} className="card-img-top" alt={item.title} />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.title}</h5>
                  <p className="card-text text-secondary">{item.excerpt}</p>
                </div>
              </div>
              {/* -------------------------------------------- */}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default HomePage;