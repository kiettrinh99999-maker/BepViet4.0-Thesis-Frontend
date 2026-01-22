import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/Authen';

const GuestLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { config, store } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        alert(`Khách đang tìm kiếm: "${searchQuery}"`);
        setSearchQuery('');
      }
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  // Xử lý khi bấm vào các link bị giới hạn
  const handleRestrictedClick = (e, path) => {
    e.preventDefault(); // Chặn chuyển trang mặc định
    if (window.confirm('Vui lòng đăng nhập để sử dụng tính năng này!')) {
      handleLogin();
    }
  };

  // CSS Config
  const styles = {
    primaryColor: '#d32f2f',
    primaryDark: '#9a0007',
    secondaryColor: '#ffb74d',
    backgroundLight: '#f9f5f0',
    backgroundWhite: '#ffffff',

    // Loading Styles
    loadingWrapper: {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f5f0'
    },
    logoWrapper: {
      animation: 'pulse 1.5s infinite'
    }
  };

  // Hàm style cho Nav Link (Active state)
  const getNavStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? styles.primaryColor : '#333333',
      fontSize: '1rem',
      fontWeight: isActive ? '700' : '500',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      borderBottom: isActive ? `2px solid ${styles.primaryColor}` : '2px solid transparent',
      paddingBottom: '5px',
      cursor: 'pointer' // Thêm cursor pointer cho các thẻ a/span
    };
  };

  // Màn hình loading khi chưa có config
  if (config == null) return (
    <div style={styles.loadingWrapper}>
      <div style={styles.logoWrapper}>
        <h3>Đang tải dữ liệu...</h3>
      </div>
    </div>
  );

  const imageUrl = `${store}/${config.data.data[0].image_path}`;

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      color: '#333',
      backgroundColor: styles.backgroundLight,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Load Font & Icon */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
          
          .btn-hover-login:hover { background-color: rgba(255,255,255,0.2) !important; }
          .btn-hover-register:hover { background-color: #f0f0f0 !important; color: #d32f2f !important; }
        `}
      </style>

      {/* Header */}
      <header style={{
        backgroundColor: styles.backgroundWhite,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>

        {/* 1. Header Top (Màu đỏ) - Chứa Logo & Nút Auth */}
        <div style={{
          backgroundColor: styles.primaryColor,
          color: 'white',
          padding: '10px 0',
          fontSize: '0.9rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              {/* Logo Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img
                    src={imageUrl}
                    alt="Logo"
                    style={{ width: '35px', height: '35px', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <Link to="/" className="text-white text-decoration-none" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    lineHeight: '1.2'
                  }}>
                    {config.data.data[0].name}
                  </Link>
                  <div style={{ fontSize: '0.8rem', opacity: '0.9', fontWeight: '300' }}>
                    Khám phá – Chia sẻ – Gìn giữ tinh hoa
                  </div>
                </div>
              </div>

              {/* Guest Actions (Login/Register) */}
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-hover-login"
                  onClick={handleLogin}
                  style={{
                    border: '1px solid white',
                    color: 'white',
                    backgroundColor: 'transparent',
                    borderRadius: '20px',
                    padding: '6px 20px',
                    fontWeight: 400,
                    transition: 'all 0.3s',
                    fontSize: '0.9rem',
                    display: 'flex',          
                    alignItems: 'center',    
                    whiteSpace: 'nowrap',     
                    gap: '8px'
                  }}
                >
                  <i className="fas fa-sign-in-alt me"></i>Đăng nhập
                </button>
                <button
                  className="btn btn-hover-register"
                  onClick={handleRegister}
                  style={{
                    backgroundColor: 'white',
                    color: styles.primaryColor,
                    border: '1px solid white',
                    borderRadius: '20px',
                    padding: '6px 20px',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="fas fa-user-plus me-2"></i>Đăng ký
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 2. Header Main (Màu trắng) - Chứa Nav & Search */}
        <div style={{ padding: '15px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px'
            }}>

              {/* Navigation Menu */}
              <nav>
                <ul style={{
                  display: 'flex',
                  listStyle: 'none',
                  gap: '30px',
                  margin: 0,
                  padding: 0,
                  flexWrap: 'wrap'
                }}>
                  <li>
                    <Link to="/" style={getNavStyle('/')}>HOME</Link>
                  </li>
                  <li>
                    <Link to="/cong-thuc" style={getNavStyle('/cong-thuc')}>CÔNG THỨC</Link>
                  </li>
                  <li>
                    <Link to="/dien-dan" style={getNavStyle('/dien-dan')}>DIỄN ĐÀN</Link>
                  </li>
                  <li>
                    <Link to="/blog" style={getNavStyle('/blog')}>BLOG</Link>
                  </li>
                  {/* Restricted Links */}


                </ul>
              </nav>

              {/* Search Box */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '20px',
                padding: '8px 15px',
                width: '300px'
              }}>
                <i className="fas fa-search" style={{ color: '#666666', marginRight: '8px' }}></i>
                <input
                  type="text"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Tìm kiếm món ăn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                />
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-5" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#9a0007',
            marginBottom: '15px'
          }}>
            {config.data.data[0].name}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666666', maxWidth: '800px', margin: '0 auto 30px' }}>
            Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2" style={{
            fontSize: '1.1rem',
            color: '#d32f2f',
            fontWeight: 500,
            marginBottom: '30px'
          }}>
            {/* Ví dụ các tag miền */}
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

      {/* Main Content Area */}
      <main style={{ minHeight: '60vh' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: styles.primaryDark,
        color: 'white',
        padding: '50px 0 30px',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
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
                {/* --- ĐÃ SỬA THÀNH ẢNH Ở ĐÂY --- */}
                <img
                  src={imageUrl}
                  alt="Logo"
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                marginBottom: 0
              }}>
                {config.data.data[0].name}
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