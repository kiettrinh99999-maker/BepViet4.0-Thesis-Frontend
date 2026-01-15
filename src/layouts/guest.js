import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authen';

const GuestLayout = () => {
  const [activeNav, setActiveNav] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  //Gọi api lấy dữ liệu cấu hình
  const { config, store } = useAuth();
  //hình website
  console.log(config);
  const handleNavClick = (nav) => {
    setActiveNav(nav);
    // Ví dụ logic cho Guest:
    if (nav === 'shopping' || nav === 'mealplan') {
      if (window.confirm('Vui lòng đăng nhập để sử dụng tính năng này!')) {
        // navigate('/login');
        console.log("Chuyển sang trang login");
      }
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        alert(`Khách đang tìm kiếm: "${searchQuery}"`);
        setSearchQuery('');
      }
    }
  };

  const handleLogin = () => {
    alert('Chuyển đến trang Đăng nhập');
  };

  const handleRegister = () => {
    alert('Chuyển đến trang Đăng ký');
  };

  // CSS inline
  const styles = {
    body: {
      fontFamily: "'Inter', sans-serif",
      color: '#333333',
      backgroundColor: '#f9f5f0',
      lineHeight: 1.6,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    headerTop: {
      backgroundColor: '#d32f2f',
      color: 'white',
      padding: '10px 0'
    },
    logo: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.8rem',
      fontWeight: 700,
      color: 'white',
      textDecoration: 'none'
    },
    logoSubtitle: {
      fontSize: '0.8rem',
      opacity: 0.9,
      fontWeight: 300,
      fontFamily: "'Inter', sans-serif"
    },
    navLink: {
      textDecoration: 'none',
      color: '#333333',
      fontWeight: 500,
      fontSize: '0.95rem',
      position: 'relative',
      transition: 'color 0.3s',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    searchBox: {
      backgroundColor: '#f5f5f5',
      borderRadius: '20px',
      padding: '8px 15px'
    },
    // Style riêng cho nút Login/Register của Guest
    btnLogin: {
      border: '1px solid white',
      color: 'white',
      backgroundColor: 'transparent',
      borderRadius: '20px',
      padding: '5px 20px',
      fontWeight: 500,
      transition: 'all 0.3s',
      fontSize: '0.9rem'
    },
    btnRegister: {
      backgroundColor: 'white',
      color: '#d32f2f',
      border: '1px solid white',
      borderRadius: '20px',
      padding: '5px 20px',
      fontWeight: 600,
      transition: 'all 0.3s',
      fontSize: '0.9rem'
    },
    heroTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '3.5rem',
      fontWeight: 700,
      color: '#9a0007',
      marginBottom: '15px'
    },
    footer: {
      backgroundColor: '#9a0007',
      color: 'white',
      padding: '50px 0 30px',
      marginTop: 'auto'
    }
  };
  
  if (config ==null) return (<div style={styles.loadingWrapper}>
    <div style={styles.logoWrapper}>
      <img
        src="http://localhost:8000/storage/config/web.jpg"
        alt="Loading"
        style={styles.logo}
      />
    </div>
  </div>)
const imageUrl = `${store}/${config.data.data[0].image_path}`;
console.log(imageUrl)
  return (
    <div style={styles.body}>
      {/* Load Font & Icon (Giống MemberLayout để đảm bảo hiển thị đúng) */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
          
          .btn-hover-login:hover { background-color: rgba(255,255,255,0.1) !important; }
          .btn-hover-register:hover { background-color: #f0f0f0 !important; }
        `}
      </style>

      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        {/* Header Top */}
        <div style={styles.headerTop}>
          <div style={styles.container}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">

              {/* Logo Section */}
              <div className="d-flex align-items-center mb-2 mb-md-0 gap-3">
                <div
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Logo"
                    style={{
                      width: '30px',
                      height: '30px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div>
                  <a href="/" style={styles.logo}>{config.data.data[0].name}</a>
                  <div style={styles.logoSubtitle}>
                    Khám phá – Chia sẻ – Gìn giữ tinh hoa
                  </div>
                </div>
              </div>

              {/* Guest Actions (Login/Register) - KHÁC BIỆT SO VỚI MEMBER */}
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-hover-login"
                  style={styles.btnLogin}
                  onClick={handleLogin}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>Đăng nhập
                </button>
                <button
                  className="btn btn-hover-register"
                  style={styles.btnRegister}
                  onClick={handleRegister}
                >
                  <i className="fas fa-user-plus me-2"></i>Đăng ký
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Header Main (Navigation) */}
        <div style={{ padding: '15px 0' }}>
          <div style={styles.container}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              {/* Navigation Menu */}
              <nav>
                <ul className="d-flex list-unstyled mb-3 mb-md-0 gap-3 gap-md-4">
                  {['home', 'recipes', 'forum', 'blog'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        style={{
                          ...styles.navLink,
                          color: activeNav === item ? '#d32f2f' : '#333333'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item);
                        }}
                        onMouseEnter={(e) => activeNav !== item && (e.target.style.color = '#d32f2f')}
                        onMouseLeave={(e) => activeNav !== item && (e.target.style.color = '#333333')}
                      >
                        {item === 'home' ? 'HOME' :
                          item === 'recipes' ? 'CÔNG THỨC' :
                            item === 'forum' ? 'DIỄN ĐÀN' :
                              item === 'blog' ? 'BLOG' :
                                item === 'shopping' ? 'SHOPPING LIST' :
                                  'KẾ HOẠCH BỮA ĂN'}
                        {activeNav === item && (
                          <span style={{
                            position: 'absolute',
                            bottom: '-5px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#d32f2f'
                          }}></span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Search Box */}
              <div className="d-flex align-items-center" style={styles.searchBox}>
                <i className="fas fa-search me-2" style={{ color: '#666666' }}></i>
                <input
                  type="text"
                  className="form-control border-0 p-0 bg-transparent"
                  placeholder="Tìm kiếm món ăn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  style={{ outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-5" style={{ textAlign: 'center' }}>
        <div style={styles.container}>
          <h1 style={styles.heroTitle}>Bếp Việt 4.0</h1>
          <p style={{ fontSize: '1.2rem', color: '#666666', maxWidth: '800px', margin: '0 auto 30px' }}>
            Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2" style={{
            fontSize: '1.1rem',
            color: '#d32f2f',
            fontWeight: 500,
            marginBottom: '30px'
          }}>
            <span style={{ padding: '5px 15px', backgroundColor: 'rgba(211, 47, 47, 0.1)', borderRadius: '20px' }}>
              Miền Bắc
            </span>
            <span style={{ padding: '5px 15px', backgroundColor: 'rgba(211, 47, 47, 0.1)', borderRadius: '20px' }}>
              Miền Trung
            </span>
            <span style={{ padding: '5px 15px', backgroundColor: 'rgba(211, 47, 47, 0.1)', borderRadius: '20px' }}>
              Miền Nam
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div className="text-center mb-4">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-utensils" style={{ color: '#d32f2f' }}></i>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                marginBottom: 0
              }}>
                Bếp Việt 4.0
              </h2>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              {config.data.data[0].copyright}
            </p>
          </div>

          <div className="text-center pt-3" style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.9rem',
            opacity: 0.7
          }}>
            Bếp Việt 4.0 - Nơi gìn giữ hương vị Việt | Hotline: {config.data.data[0].phone} | Email: {config.data.data[0].email} 
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;