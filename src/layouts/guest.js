import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. CẤU HÌNH MÀU SẮC & FONT CHUẨN (GIỐNG GUEST)
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

// 2. DỮ LIỆU GIẢ LẬP (MOCK DATA - Dữ liệu riêng cho Member)
const myRecipesData = [
  {
    id: 1,
    tag: "ĐÃ LƯU",
    title: "Cơm tấm sườn nướng mật ong",
    desc: "Món tủ của mình, đã làm thử 3 lần và rất thành công.",
    rating: 5,
    reviews: "Của bạn",
    img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    tag: "ĐANG NẤU",
    title: "Phở bò tái nạm",
    desc: "Đang nghiên cứu cách ninh xương sao cho trong nước.",
    rating: 4,
    reviews: "Của bạn",
    img: "https://images.unsplash.com/photo-1585325701165-351af916e581?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

const recommendData = [
  {
    id: 3,
    tag: "GỢI Ý HÔM NAY",
    title: "Canh chua cá lóc miền Tây",
    desc: "Món ăn thanh mát giải nhiệt cho những ngày hè nóng bức.",
    rating: 4.8,
    reviews: "10k+",
    img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

// 3. COMPONENT CON
const StarRating = ({ count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= count) {
      stars.push(<i key={i} className="fas fa-star" style={{ color: THEME.colors.secondary, marginRight: '5px' }}></i>);
    } else {
      stars.push(<i key={i} className="far fa-star" style={{ color: THEME.colors.secondary, marginRight: '5px' }}></i>);
    }
  }
  return <div className="d-flex align-items-center">{stars}</div>;
};

// 4. MAIN COMPONENT: MEMBER LAYOUT
const LayoutMember = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // State cho menu user

  // --- LOGIC XỬ LÝ ---
  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi Bếp Việt 4.0?')) {
      // Xử lý clear token ở đây
      console.log('Đã đăng xuất');
      navigate('/login'); 
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      alert(`Member đang tìm kiếm: "${searchTerm}"`);
      setSearchTerm('');
    }
  };

  return (
    <div style={{ backgroundColor: THEME.colors.bgLight, fontFamily: THEME.fonts.body, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- HEADER (DÀNH CHO MEMBER) --- */}
      {/* --- HEADER (DÀNH CHO MEMBER) --- */}
      <header className="sticky-top shadow-sm" style={{ backgroundColor: THEME.colors.bgWhite, zIndex: 1000 }}>
        
        {/* Top Bar màu đỏ */}
        {/* SỬA LỖI Ở ĐÂY: Thêm position: 'relative' và zIndex: 1100 để nó nằm trên thanh tìm kiếm */}
        <div style={{ backgroundColor: THEME.colors.primary, color: 'white', position: 'relative', zIndex: 1100 }} className="py-2">
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
            
            {/* Logo Section */}
            <div className="d-flex align-items-center gap-3 mb-2 mb-md-0">
              <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="fas fa-utensils fs-5" style={{ color: THEME.colors.primary }}></i>
              </div>
              <div className="d-flex flex-column text-start">
                <Link to="/dashboard" className="text-white text-decoration-none fw-bold" style={{ fontFamily: THEME.fonts.heading, fontSize: '1.5rem', lineHeight: 1 }}>
                  Bếp Việt 4.0
                </Link>
                <small style={{ fontSize: '0.75rem', opacity: 0.9 }}>Xin chào, Nguyễn Văn</small>
              </div>
            </div>
            
            {/* User Profile Section */}
            <div className="position-relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="btn d-flex align-items-center gap-2 text-white border-0 p-1 rounded-pill" 
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingRight: '15px' }}
              >
                <div className="bg-white text-danger fw-bold rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                  NV
                </div>
                <span className="d-none d-sm-block small fw-bold pe-2">Nguyễn Văn</span>
                <i className={`fas fa-chevron-down small transition-transform ${showDropdown ? 'fa-rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="position-absolute end-0 mt-2 bg-white rounded shadow-lg py-2" 
                     style={{ width: '200px', zIndex: 9999, top: '100%' }}> {/* Tăng zIndex ở đây nữa cho chắc */}
                  <Link to="/profile" className="dropdown-item px-3 py-2 hover-bg-light text-dark">
                    <i className="fas fa-user-circle me-2 text-muted"></i> Hồ sơ cá nhân
                  </Link>
                  <Link to="/my-recipes" className="dropdown-item px-3 py-2 hover-bg-light text-dark">
                    <i className="fas fa-book me-2 text-muted"></i> Công thức của tôi
                  </Link>
                  <Link to="/settings" className="dropdown-item px-3 py-2 hover-bg-light text-dark">
                    <i className="fas fa-cog me-2 text-muted"></i> Cài đặt
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item px-3 py-2 text-danger w-100 text-start">
                    <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation & Search - Phần này giữ nguyên, vì Top Bar đã cao hơn nên Dropdown sẽ đè lên phần này */}
        <div className="py-3" style={{ position: 'relative', zIndex: 1000 }}>
          <div className="container">
            <div className="row align-items-center gy-3">
              <div className="col-md-8">
                <nav className="nav d-flex justify-content-center justify-content-md-start gap-4 fw-bold">
                  {[
                    {name: 'DASHBOARD', link: '/dashboard', active: true},
                    {name: 'CÔNG THỨC', link: '/recipes', active: false},
                    {name: 'SHOPPING LIST', link: '/shopping-list', active: false},
                    {name: 'KẾ HOẠCH ĂN', link: '/meal-plan', active: false},
                    {name: 'DIỄN ĐÀN', link: '/forum', active: false}
                  ].map((item, idx) => (
                    <Link key={idx} to={item.link} className="nav-link p-0 position-relative text-uppercase" 
                          style={{ 
                            color: item.active ? THEME.colors.primary : THEME.colors.textDark, 
                            borderBottom: item.active ? `2px solid ${THEME.colors.primary}` : 'none' 
                          }}>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="col-md-4">
                <div className="input-group rounded-pill overflow-hidden bg-light border-0 px-3 py-1" style={{ backgroundColor: '#f5f5f5' }}>
                  <span className="input-group-text border-0 bg-transparent text-muted"><i className="fas fa-search"></i></span>
                  <input 
                    type="text" 
                    className="form-control border-0 bg-transparent shadow-none" 
                    placeholder="Tìm món ăn, công thức..." 
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

      {/* --- BODY CONTENT (DASHBOARD) --- */}
      <main className="flex-grow-1">
        
        {/* Welcome Banner */}
        <section className="py-4" style={{ background: 'linear-gradient(to right, #ffeaa7, #fff3cd)' }}>
          <div className="container">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h2 className="fw-bold mb-1" style={{ fontFamily: THEME.fonts.heading, color: THEME.colors.primaryDark }}>
                  Hôm nay bạn muốn nấu gì?
                </h2>
                <p className="mb-0 text-muted">Bạn có <strong className="text-danger">2</strong> công thức đang lưu trong giỏ đi chợ.</p>
              </div>
              <div className="d-none d-md-block">
                <button className="btn btn-danger rounded-pill px-4 shadow-sm">
                  <i className="fas fa-plus me-2"></i> Tạo công thức mới
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* My Recipes Section */}
        <section className="py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <h3 className="fw-bold fs-3 mb-0" style={{ fontFamily: THEME.fonts.heading, color: THEME.colors.textDark }}>
                Công thức của bạn
              </h3>
              <Link to="/my-recipes" className="text-decoration-none" style={{ color: THEME.colors.primary }}>Xem tất cả <i className="fas fa-arrow-right small"></i></Link>
            </div>
            
            <div className="row g-4">
              {myRecipesData.map(recipe => (
                <div key={recipe.id} className="col-12 col-md-6">
                  <div className="card h-100 border-0 shadow-sm recipe-card d-flex flex-row overflow-hidden">
                     <div style={{ width: '40%', minWidth: '150px' }}>
                        <img src={recipe.img} className="w-100 h-100" alt={recipe.title} style={{ objectFit: 'cover' }} />
                     </div>
                     <div className="card-body p-3 d-flex flex-column justify-content-center">
                        <span className="badge bg-warning text-dark mb-2 align-self-start">{recipe.tag}</span>
                        <h5 className="card-title fw-bold mb-1">{recipe.title}</h5>
                        <p className="card-text text-muted small mb-2">{recipe.desc}</p>
                        <div className="mt-auto">
                           <StarRating count={recipe.rating} />
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendation Section */}
        <section className="pb-5">
           <div className="container">
            <h3 className="fw-bold fs-3 mb-4" style={{ fontFamily: THEME.fonts.heading, color: THEME.colors.textDark }}>
              Gợi ý từ cộng đồng
            </h3>
            <div className="row g-4">
               {recommendData.map(recipe => (
                  <div key={recipe.id} className="col-12 col-md-4">
                     <div className="card h-100 border-0 shadow-sm">
                        <div className="position-relative" style={{ height: '200px' }}>
                           <img src={recipe.img} className="w-100 h-100" style={{ objectFit: 'cover', borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }} alt="" />
                           <span className="position-absolute top-0 end-0 m-2 badge bg-danger">HOT</span>
                        </div>
                        <div className="card-body">
                           <h5 className="fw-bold">{recipe.title}</h5>
                           <p className="text-muted small">{recipe.desc}</p>
                           <div className="d-flex justify-content-between align-items-center">
                              <StarRating count={recipe.rating} />
                              <small className="text-muted"><i className="fas fa-heart text-danger me-1"></i> {recipe.reviews}</small>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
               
               {/* Banner quảng cáo tính năng Premium */}
               <div className="col-12 col-md-8">
                  <div className="h-100 rounded-3 p-4 d-flex align-items-center text-white" 
                       style={{ background: `linear-gradient(45deg, ${THEME.colors.primaryDark}, ${THEME.colors.primary})` }}>
                     <div>
                        <h3 className="fw-bold mb-2">Trở thành Đầu Bếp Pro?</h3>
                        <p className="mb-3 opacity-75">Mở khóa tính năng lập kế hoạch bữa ăn và tính toán calo ngay hôm nay.</p>
                        <button className="btn btn-light text-danger fw-bold rounded-pill px-4">Tìm hiểu ngay</button>
                     </div>
                     <div className="ms-auto d-none d-md-block fs-1 opacity-50">
                        <i className="fas fa-crown"></i>
                     </div>
                  </div>
               </div>
            </div>
           </div>
        </section>

      </main>

      {/* --- FOOTER (GIỐNG HỆT GUEST) --- */}
      <footer style={{ 
          backgroundColor: THEME.colors.primaryDark, 
          color: 'white', 
          padding: '40px 0 20px', 
          marginTop: 'auto' 
      }}>
        <div className="container">
          <div className="d-flex flex-wrap mb-4" style={{ gap: '30px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2" 
                   style={{ fontFamily: THEME.fonts.heading, fontSize: '2rem' }}>
                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '40px', height: '40px' }}>
                  <i className="fas fa-utensils" style={{ color: THEME.colors.primary, fontSize: '1.5rem' }}></i>
                </div>
                Bếp Việt 4.0
              </div>
              <p className="mb-4" style={{ opacity: 0.8 }}>© 2028 BÁS VỌK 4D - Câu lạc bộ ẩm thực VN</p>
            </div>
          </div>
          <div className="text-center pt-3" style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              fontSize: '0.9rem', 
              opacity: 0.7 
          }}>
            <p className="mb-0">Bếp Việt 4.0 - Nơi gìn giữ hương vị Việt | Member Area</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LayoutMember;