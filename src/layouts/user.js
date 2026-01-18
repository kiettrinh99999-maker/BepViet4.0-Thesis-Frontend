import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const MemberLayout = ({ children, showLoginNotice = false }) => {
  const [activeNav, setActiveNav] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (nav) => {
    setActiveNav(nav);
    if (nav === 'home') {
      navigate('/dashboard');
    } else if (nav === 'recipes') {
      navigate('/dashboard/recipes');
    } else if (nav === 'forum') {
      alert('Chuyển đến trang: DIỄN ĐÀN');
    } else if (nav === 'blog') {
      alert('Chuyển đến trang: BLOG');
    } else if (nav === 'shopping') {
      alert('Chuyển đến trang: SHOPPING LIST');
    } else if (nav === 'mealplan') {
      alert('Chuyển đến trang: KẾ HOẠCH BỮA ĂN');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      alert('Đăng xuất thành công! Chuyển về trang chủ chưa đăng nhập.');
    }
    setShowDropdown(false);
  };

  const handleMyRecipes = () => {
    alert('Chuyển đến trang "My công thức" - Bạn có 15 công thức đã lưu');
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        alert(`Đang tìm kiếm: "${searchQuery}". Chức năng tìm kiếm đang được phát triển.`);
        setSearchQuery('');
      }
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // CSS inline để giữ nguyên style gốc
  const styles = {
    body: {
      fontFamily: "'Inter', sans-serif",
      color: '#333333',
      backgroundColor: '#f9f5f0',
      lineHeight: 1.6
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
      fontWeight: 300
    },
    navLink: {
      textDecoration: 'none',
      color: '#333333',
      fontWeight: 500,
      fontSize: '1rem',
      position: 'relative',
      transition: 'color 0.3s'
    },
    searchBox: {
      backgroundColor: '#f5f5f5',
      borderRadius: '20px',
      padding: '8px 15px'
    },
    userAvatar: {
      width: '30px',
      height: '30px',
      background: 'linear-gradient(135deg, #d32f2f, #ff6659)',
      color: 'white',
      borderRadius: '50%',
      border: '2px solid white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: '0.9rem'
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 5px)',
      right: 0,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      minWidth: '180px',
      zIndex: 1000,
      overflow: 'hidden',
      border: '1px solid #e0e0e0',
      display: showDropdown ? 'block' : 'none'
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 15px',
      color: '#333333',
      textDecoration: 'none',
      transition: 'all 0.3s',
      borderBottom: '1px solid #e0e0e0',
      cursor: 'pointer',
      backgroundColor: 'white'
    },
    heroTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '3rem',
      color: '#9a0007',
      marginBottom: '10px'
    },
    sectionTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2rem',
      color: '#9a0007',
      position: 'relative',
      textAlign: 'center',
      marginBottom: '30px'
    },
    footer: {
      backgroundColor: '#9a0007',
      color: 'white',
      padding: '40px 0 20px',
      marginTop: '50px'
    }
  };

  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#ffffff', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
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
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-utensils" style={{ fontSize: '1.8rem', color: '#d32f2f' }}></i>
                </div>
                <div>
                  <a href="/" style={styles.logo}>Bếp Việt 4.0</a>
                  <div style={styles.logoSubtitle}>
                    Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam
                  </div>
                </div>
              </div>
              
              {/* User Profile với Dropdown */}
              <div className="d-flex align-items-center" ref={dropdownRef}>
                <div className="position-relative">
                  <button 
                    className="btn d-flex align-items-center gap-2" 
                    style={{ 
                      backgroundColor: 'white',
                      color: '#d32f2f',
                      border: '1px solid white',
                      padding: '6px 15px',
                      borderRadius: '25px',
                      fontWeight: 600,
                      transition: 'all 0.3s'
                    }}
                    onClick={toggleDropdown}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.color = '#9a0007';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#d32f2f';
                    }}>
                    <div style={styles.userAvatar}>NV</div>
                    <span style={{ 
                      color: '#d32f2f', 
                      fontWeight: 600,
                      transition: 'color 0.3s'
                    }}>Nguyễn Văn</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div style={styles.dropdown}>
                    <div 
                      style={{
                        ...styles.dropdownItem,
                        borderBottom: '1px solid #e0e0e0'
                      }}
                      onClick={handleMyRecipes}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.05)';
                        e.currentTarget.style.color = '#d32f2f';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#333333';
                      }}>
                      <i className="fas fa-book" style={{ color: '#d32f2f', width: '18px', textAlign: 'center' }}></i>
                      <span>My công thức</span>
                    </div>
                    <div 
                      style={styles.dropdownItem}
                      onClick={handleLogout}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.05)';
                        e.currentTarget.style.color = '#d32f2f';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#333333';
                      }}>
                      <i className="fas fa-sign-out-alt" style={{ color: '#d32f2f', width: '18px', textAlign: 'center' }}></i>
                      <span>Đăng xuất</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Header Main */}
        <div style={{ padding: '15px 0' }}>
          <div style={styles.container}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              {/* Navigation Menu */}
              <nav>
                <ul className="d-flex list-unstyled mb-3 mb-md-0 gap-3 gap-md-4">
                  {['home', 'recipes', 'forum', 'blog', 'shopping', 'mealplan'].map((item) => (
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
                  placeholder="Search here..."
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
              © 2028 BÁS VỌK 4D - Câu lạc bộ ẩm thực VN
            </p>
          </div>
          
          <div className="text-center pt-3" style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.9rem',
            opacity: 0.7
          }}>
            Bếp Việt 4.0 - Nơi gìn giữ hương vị Việt | Hotline: 1900 1234 | Email: contact@bepviet40.vn
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MemberLayout;