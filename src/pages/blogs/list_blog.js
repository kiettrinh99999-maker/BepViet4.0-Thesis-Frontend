import React, { useState, useEffect } from 'react';
import BlogCard from '../../components/Blogs/BlogCard';
import './blog.css';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  
  // Danh sách danh mục để hiển thị bộ lọc
  const categories = [
    'Tất cả', 'Lịch sử ẩm thực', 'Trải nghiệm ẩm thực', 
    'Đặc sản vùng miền', 'Văn hóa ẩm thực', 'Nguyên liệu đặc biệt', 
    'Công thức bí truyền', 'Ẩm thực đường phố'
  ];

  // Dữ liệu mẫu - Sau này bạn sẽ dùng useEffect để gọi API từ Laravel
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      category: 'LỊCH SỬ ẨM THỰC',
      title: 'Hành trình của Phở: Từ những gánh hàng rong đến thương hiệu quốc gia',
      excerpt: 'Phở không chỉ là món ăn mà còn là biểu tượng văn hóa Việt Nam. Bài viết khám phá lịch sử hình thành và phát triển của phở...',
      author: 'Mai Trang',
      authorInitials: 'MT',
      date: '12/07/2023',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      category: 'TRẢI NGHIỆM ẨM THỰC',
      title: 'Sài Gòn về đêm: Hành trình khám phá ẩm thực đường phố không ngủ',
      excerpt: 'Từ những quán hủ tiếu mở cửa đến 2h sáng đến những xe bánh mì thịt nướng giữa đêm khuya, Sài Gòn mang đến trải nghiệm độc đáo...',
      author: 'Trung Vũ',
      authorInitials: 'TV',
      date: '05/07/2023',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      category: 'ĐẶC SẢN VÙNG MIỀN',
      title: 'Cao Lầu Hội An: Bí mật từ sợi mì độc nhất vô nhị',
      excerpt: 'Cao lầu Hội An không chỉ là món ăn mà còn là câu chuyện về sự giao thoa văn hóa Việt - Hoa - Nhật...',
      author: 'Lan Hương',
      authorInitials: 'LH',
      date: '28/06/2023',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // Logic lọc bài viết theo danh mục (Client-side filter)
  const filteredPosts = activeCategory === 'Tất cả' 
    ? blogPosts 
    : blogPosts.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="blog-page-wrapper">
      {/* Thông báo đăng nhập */}
      {/* <div className="container">
        <div className="login-notice">
          <i className="fas fa-info-circle"></i> Tài khoản chưa đăng nhập. Vui lòng <strong>Đăng nhập</strong> để tương tác và lưu bài viết yêu thích.
        </div>
      </div> */}

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Blog Ẩm Thực Việt</h1>
          <p>Khám phá những câu chuyện, trải nghiệm và kiến thức đặc biệt về ẩm thực ba miền</p>
          <div className="hero-tagline">
            <span>Lịch sử ẩm thực</span>
            <span>Trải nghiệm văn hóa</span>
            <span>Đặc sản vùng miền</span>
          </div>
        </div>
      </section>

      {/* Bộ lọc danh mục */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-container">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bài viết nổi bật (Featured Post) */}
      <section className="featured-blog">
        <div className="container">
          <div className="featured-card">
            <div className="featured-image">
              <img src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80" alt="Bánh chưng Tết" />
            </div>
            <div className="featured-content">
              <div className="featured-badge">NỔI BẬT</div>
              <h2 className="featured-title">Bánh Chưng - Hồn cốt ẩm thực Tết Việt</h2>
              <p className="featured-excerpt">Khám phá lịch sử hàng ngàn năm của bánh chưng, từ truyền thuyết Lang Liêu đến ý nghĩa triết lý Âm Dương Ngũ Hành trong từng lớp bánh.</p>
              <button className="action-btn view" style={{ width: 'fit-content', padding: '10px 25px' }}>
                <i className="far fa-eye"></i> Đọc bài viết
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách bài viết */}
      <section className="blog-section">
        <div className="container">
          <h2 className="section-title">Bài Viết Mới Nhất</h2>
          <div className="blog-grid">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <p className="no-posts">Không có bài viết nào trong danh mục này.</p>
            )}
          </div>

          {/* Phân trang */}
          <div className="pagination">
            <button className="pagination-btn disabled"><i className="fas fa-chevron-left"></i></button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-btn"><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;