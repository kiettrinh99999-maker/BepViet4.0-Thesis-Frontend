import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/Authen';

const MemberLayout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const {user, logout, config, store } = useAuth();

  // 1. Xử lý logic tìm kiếm
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      alert(`Đang tìm kiếm: "${searchQuery}"`);
      setSearchQuery('');
    }
  };

  // 2. Xử lý đăng xuất
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout()
      navigate('/');
    }
  };

  // 3. Định nghĩa Style
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

  // 4. Hàm helper để xác định style cho Nav Link (Active state)
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
      cursor: 'pointer'
    };
  };

  // 5. Kiểm tra dữ liệu config trước khi render
  if (config == null) return (
    <div style={styles.loadingWrapper}>
      <div style={styles.logoWrapper}>
        <h3>Đang tải dữ liệu...</h3>
      </div>
    </div>
  );

  // Lấy data từ config sau khi đã check null
  const data_config = config.data.data[0];
  const imageUrl = `${store}/${data_config.image_path}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header */}
      <header style={{
        backgroundColor: styles.backgroundWhite,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        
        {/* --- Header Top (Màu đỏ) --- */}
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
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <div>
                  <Link to="/" className="text-white text-decoration-none" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    lineHeight: '1.2'
                  }}>
                    {data_config.name}
                  </Link>
                  <div style={{ fontSize: '0.8rem', opacity: '0.9', fontWeight: '300' }}>
                    Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam
                  </div>
                </div>
              </div>

              {/* User Profile Dropdown */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  className="btn d-flex align-items-center gap-2"
                  style={{
                    backgroundColor: 'white',
                    color: styles.primaryColor,
                    border: '1px solid white',
                    padding: '6px 15px',
                    borderRadius: '25px',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    background: `linear-gradient(135deg, ${styles.primaryColor}, #ff6659)`,
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    border: '2px solid white'
                  }}>
                    NV
                  </div>
                  <span style={{ color: styles.primaryColor, fontWeight: '600' }}>Nguyễn Văn</span>
                </button>

                {isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 5px)',
                      right: '0',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      minWidth: '180px',
                      zIndex: 100,
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0'
                    }}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link
                      to="/profile"
                      className="d-flex align-items-center gap-2 text-dark text-decoration-none p-3"
                      style={{
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '0.95rem'
                      }}
                    >
                      <i className="bi bi-person" style={{ width: '18px', color: styles.primaryColor }}></i>
                      Hồ sơ
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="d-flex align-items-center gap-2 text-dark text-decoration-none p-3 w-100 border-0 bg-white"
                      style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      <i className="bi bi-box-arrow-right" style={{ width: '18px', color: styles.primaryColor }}></i>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Header Main (Màu trắng) --- */}
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
                  <li>
                    <Link to="/shopping-list" style={getNavStyle('/shopping-list')}>SHOPPING LIST</Link>
                  </li>
                  <li>
                    <Link to="/meal-plan" style={getNavStyle('/meal-plan')}>KẾ HOẠCH BỮA ĂN</Link>
                  </li>
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
                <i className="bi bi-search" style={{ color: '#666666', marginRight: '8px' }}></i>
                <input
                  type="text"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                />
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ backgroundColor: styles.backgroundLight, flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: styles.primaryDark,
        color: 'white',
        padding: '40px 0 20px',
        marginTop: '50px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              marginBottom: '10px'
            }}>
              <div style={{
                backgroundColor: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
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
              {data_config.name}
            </div>
            <p style={{ marginBottom: '20px', opacity: '0.8' }}>
              {data_config.copyright}
            </p>
          </div>
          <div style={{
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.9rem',
            opacity: '0.7'
          }}>
            <p style={{ margin: 0 }}>
              {data_config.name} - Nơi gìn giữ hương vị Việt | Hotline: {data_config.phone} | Email: {data_config.email}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MemberLayout;