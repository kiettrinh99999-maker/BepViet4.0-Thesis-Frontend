import React, { useState } from 'react';

// 1. CẤU HÌNH MÀU SẮC & FONT CHUẨN (CONSTANTS)
const THEME = {
  colors: {
    primary: '#d32f2f',       // Đỏ chủ đạo
    primaryDark: '#9a0007',   // Đỏ đậm
    secondary: '#ffb74d',     // Cam nhạt
    textDark: '#333333',
    textLight: '#666666',
    bgLight: '#f9f5f0',       // Màu kem nền
    bgWhite: '#ffffff',
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Playfair Display', serif",
  }
};

// 2. DỮ LIỆU GIẢ LẬP (MOCK DATA)
const recipesData = [
  {
    id: 1,
    tag: "MIỀN NAM - NGÀY THƯỜNG",
    title: "Cơm tấm sườn nướng mật ong trứng ốp la",
    desc: "Cơm tấm với sườn nướng mật ong thơm ngon, trứng ốp la và nước mắm chua ngọt đặc trưng Sài Gòn.",
    rating: 5,
    reviews: "30581",
    img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    tag: "MIỀN BẮC - NGÀY THƯỜNG",
    title: "Phở bò tái nạm gầu gân bò viên đặc biệt",
    desc: "Phở bò Hà Nội truyền thống với nước dùng đậm đà, thịt bò tái, nạm, gầu, gân và viên bò thơm ngon.",
    rating: 4.5,
    reviews: "31591",
    img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    tag: "MIỀN TRUNG - NGÀY TẾT",
    title: "Canh chua cá lóc dọc mùng thơm cà chua",
    desc: "Canh chua miền Tây với cá lóc đồng, dọc mùng, thơm, cà chua và me chua ngọt hài hòa.",
    rating: 4.5,
    reviews: "29541",
    img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

const blogData = [
  { id: 1, type: "LỊCH SỬ ẨM THỰC", title: "Bát Bún Riêu cua đồng", content: "Dậm chất kỷ niệm, sống mãi với thời gian. Món ăn dân dã nhưng chứa đựng hương vị quê hương khó quên..." },
  { id: 2, type: "TRẢI NGHIỆM ẨM THỰC", title: "Món Hủ Tiếu Nam Vang", content: "Ăn sáng, trưa hay tối đều thấy ghiền. Sợi hủ tiếu dai, nước dùng ngọt thanh và đầy đủ topping hấp dẫn..." },
  { id: 3, type: "LỊCH SỬ ẨM THỰC", title: "Món Canh Bồi của người Ê-đê", content: "Ăn 100 lần vẫn thấy ngon như lần đầu. Món canh đặc sản Tây Nguyên với hương vị độc đáo khó quên..." },
  { id: 4, type: "TRẢI NGHIỆM ẨM THỰC", title: "Công thức Cơm Tấm 'bụi'", content: "Công thức Cơm Tấm 'bụi' đúng chất Sài Gòn, ăn một lần là mê mãi. Hương vị đậm đà, chân chất..." },
  { id: 5, type: "LỊCH SỬ ẨM THỰC", title: "Hương vị Bún Mắm miền Tây", content: "Hương vị Bún Mắm miền Tây đậm đà, 'vừa ăn vừa nghe cái lương'. Món ăn dân dã với nước mắm đặc biệt..." },
  { id: 6, type: "TRẢI NGHIỆM ẨM THỰC", title: "Bí quyết làm Bánh Xèo", content: "Bí quyết làm Bánh Xèo giòn tan, vàng ruộm chuẩn vị miền Tây. Lớp vỏ giòn rụm, nhân tôm thịt đầy đặn..." },
];

// 3. CÁC COMPONENT CON

const StarRating = ({ count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= count) {
      stars.push(<i key={i} className="fas fa-star" style={{ color: THEME.colors.secondary, marginRight: '5px' }}></i>);
    } else if (i === Math.ceil(count) && !Number.isInteger(count)) {
      stars.push(<i key={i} className="fas fa-star-half-alt" style={{ color: THEME.colors.secondary, marginRight: '5px' }}></i>);
    } else {
      stars.push(<i key={i} className="far fa-star" style={{ color: THEME.colors.secondary, marginRight: '5px' }}></i>);
    }
  }
  return <div className="d-flex align-items-center">{stars}</div>;
};

const LayoutGuest = () => {
  // State quản lý search
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      alert(`Đang tìm kiếm: "${searchTerm}". Chức năng tìm kiếm đang được phát triển.`);
      setSearchTerm('');
    }
  };

  const handleNotDev = (feature) => {
    alert(`Chức năng ${feature} đang được phát triển. Vui lòng quay lại sau!`);
  };

  return (
    <div style={{ backgroundColor: THEME.colors.bgLight, fontFamily: THEME.fonts.body, minHeight: '100vh', color: THEME.colors.textDark }}>
      
      {/* HEADER */}
      <header className="sticky-top shadow-sm" style={{ backgroundColor: THEME.colors.bgWhite, zIndex: 1000 }}>
        {/* Top Bar */}
        <div style={{ backgroundColor: THEME.colors.primary, color: 'white' }} className="py-2">
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3 mb-2 mb-md-0">
              <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="fas fa-utensils fs-5" style={{ color: THEME.colors.primary }}></i>
              </div>
              <div className="d-flex flex-column text-start">
                <a href="/" className="text-white text-decoration-none fw-bold" style={{ fontFamily: THEME.fonts.heading, fontSize: '1.5rem', lineHeight: 1 }}>Bếp Việt 4.0</a>
                <small style={{ fontSize: '0.75rem', opacity: 0.9 }}>Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam</small>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button onClick={() => handleNotDev('Đăng nhập')} className="btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1" style={{ border: '1px solid white', color: 'white' }}>
                <i className="fas fa-sign-in-alt"></i> Đăng nhập
              </button>
              <button onClick={() => handleNotDev('Đăng ký')} className="btn btn-sm bg-white rounded-pill px-3 d-flex align-items-center gap-1" style={{ color: THEME.colors.primary }}>
                <i className="fas fa-user-plus"></i> Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Navigation & Search */}
        <div className="py-3">
          <div className="container">
            <div className="row align-items-center gy-3">
              <div className="col-md-8">
                <nav className="nav d-flex justify-content-center justify-content-md-start gap-4 fw-bold">
                  {['HOME', 'CÔNG THỨC', 'DIỄN ĐÀN', 'BLOG'].map((item, idx) => (
                    <a key={idx} href="#" className="nav-link p-0 position-relative text-uppercase" 
                       style={{ color: idx === 0 ? THEME.colors.primary : THEME.colors.textDark, borderBottom: idx === 0 ? `2px solid ${THEME.colors.primary}` : 'none' }}>
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="col-md-4">
                <div className="input-group rounded-pill overflow-hidden bg-light border-0 px-3 py-1" style={{ backgroundColor: '#f5f5f5' }}>
                  <span className="input-group-text border-0 bg-transparent text-muted"><i className="fas fa-search"></i></span>
                  <input 
                    type="text" 
                    className="form-control border-0 bg-transparent shadow-none" 
                    placeholder="Search here..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* LOGIN NOTICE */}
      <div className="container mt-4">
        <div className="alert d-flex align-items-center justify-content-center gap-2" role="alert" 
             style={{ backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeaa7' }}>
          <i className="fas fa-info-circle"></i>
          <span>Tài khoản chưa đăng nhập. Vui lòng <strong>Đăng nhập</strong> để tương tác và lưu công thức yêu thích.</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: THEME.fonts.heading, color: THEME.colors.primaryDark }}>Bếp Việt 4.0</h1>
          <p className="lead mb-4 mx-auto" style={{ color: THEME.colors.textLight, maxWidth: '800px' }}>Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {['Miền Bắc', 'Miền Trung', 'Miền Nam'].map((region, idx) => (
              <span key={idx} className="badge rounded-pill px-3 py-2 fw-normal text-dark" 
                    style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: THEME.colors.primary, fontSize: '1rem' }}>
                <span style={{color: THEME.colors.primary}}>{region}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED RECIPES */}
      <section className="mb-5">
        <div className="container">
          <div className="text-center position-relative mb-5">
            <h2 className="fw-bold fs-2 d-inline-block pb-2" style={{ fontFamily: THEME.fonts.heading, color: THEME.colors.primaryDark, borderBottom: `3px solid ${THEME.colors.secondary}` }}>
              Công thức nổi bật
            </h2>
          </div>
          
          <div className="row g-4">
            {recipesData.map(recipe => (
              <div key={recipe.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm recipe-card" style={{ transition: 'transform 0.3s, box-shadow 0.3s' }}
                     onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)'; }}>
                  <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                    <span className="position-absolute badge rounded-pill top-0 start-0 m-3 px-3 py-2 z-2" style={{ backgroundColor: THEME.colors.primary }}>
                      {recipe.tag}
                    </span>
                    <img src={recipe.img} className="card-img-top w-100 h-100" alt={recipe.title} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-2" style={{ color: THEME.colors.textDark }}>{recipe.title}</h5>
                    <p className="card-text text-muted small mb-3">{recipe.desc}</p>
                    <div className="d-flex align-items-center gap-2 mb-0">
                      <StarRating count={recipe.rating} />
                      <small className="text-muted" style={{ fontSize: '0.85rem' }}>{recipe.reviews} Lượt đánh giá</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="mb-5 pb-5">
        <div className="container">
          <div className="text-center position-relative mb-5">
            <h2 className="fw-bold fs-2 d-inline-block pb-2" style={{ fontFamily: THEME.fonts.heading, color: THEME.colors.primaryDark, borderBottom: `3px solid ${THEME.colors.secondary}` }}>
              Trải Nghiệm Ẩm Thực
            </h2>
          </div>

          <div className="row g-4">
            {blogData.map(blog => (
              <div key={blog.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <div className="card-header text-white d-flex justify-content-between align-items-center py-3" style={{ backgroundColor: THEME.colors.primaryDark }}>
                    <span className="fw-bold text-uppercase" style={{ fontSize: '0.9rem' }}>{blog.type}</span>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-2" style={{ color: THEME.colors.primary, fontSize: '1.25rem' }}>{blog.title}</h5>
                    <p className="card-text fst-italic text-dark mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {blog.content.length > 50 ? blog.content.substring(0, 50) + '...' : blog.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      {/* FOOTER - Đã chỉnh sửa lại cho giống hệt HTML gốc */}
      <footer style={{ 
          backgroundColor: THEME.colors.primaryDark, 
          color: 'white', 
          padding: '40px 0 20px', 
          marginTop: '50px' 
      }}>
        <div className="container">
          {/* Phần Footer Content */}
          <div className="d-flex flex-wrap mb-4" style={{ gap: '30px', justifyContent: 'space-between' }}>
            
            {/* Footer About: Giữ nguyên style dị biệt của HTML gốc (min-width: 100% để căn giữa) */}
            <div style={{ flex: 1, textAlign: 'center', minWidth: '100%' }}>
              
              {/* Logo Footer */}
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2" 
                   style={{ fontFamily: THEME.fonts.heading, fontSize: '2rem' }}>
                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '40px', height: '40px' }}>
                  <i className="fas fa-utensils" style={{ color: THEME.colors.primary, fontSize: '1.5rem' }}></i>
                </div>
                Bếp Việt 4.0
              </div>
              
              {/* Copyright Text */}
              <p className="mb-4" style={{ opacity: 0.8 }}>© 2028 BÁS VỌK 4D - Câu lạc bộ ẩm thực VN</p>
            </div>
          </div>

          {/* Phần Footer Bottom - Border mờ */}
          <div className="text-center pt-3" style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              fontSize: '0.9rem', 
              opacity: 0.7 
          }}>
            <p className="mb-0">Bếp Việt 4.0 - Nơi gìn giữ hương vị Việt | Hotline: 1900 1234 | Email: contact@bepviet40.vn</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LayoutGuest;