import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const MemberLayout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
    alert(`Chuyển đến trang: ${nav === 'home' ? 'HOME' : 
           nav === 'recipes' ? 'CÔNG THỨC' : 
           nav === 'forum' ? 'DIỄN ĐÀN' : 
           nav === 'blog' ? 'BLOG' : 
           nav === 'shopping' ? 'SHOPPING LIST' : 
           'KẾ HOẠCH BỮA ĂN'}`);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      alert('Đăng xuất thành công!');
      navigate('/');
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      alert(`Đang tìm kiếm: "${searchQuery}"`);
      setSearchQuery('');
    }
  };

  const styles = {
    primaryColor: '#d32f2f',
    primaryDark: '#9a0007',
    secondaryColor: '#ffb74d',
    backgroundLight: '#f9f5f0',
    backgroundWhite: '#ffffff',
  };

  return (
    <>
      {/* Header */}
      <header style={{
        backgroundColor: styles.backgroundWhite,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        {/* Header Top */}
        <div style={{
          backgroundColor: styles.primaryColor,
          color: 'white',
          padding: '10px 0',
          fontSize: '0.9rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  <i className="bi bi-utensils" style={{ fontSize: '1.8rem', color: styles.primaryColor }}></i>
                </div>
                <div>
                  <Link to="/" className="text-white text-decoration-none" style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: '1.8rem', 
                    fontWeight: '700',
                    lineHeight: '1.2'
                  }}>
                    Bếp Việt 4.0
                  </Link>
                  <div style={{ fontSize: '0.8rem', opacity: '0.9', fontWeight: '300' }}>
                    Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam
                  </div>
                </div>
              </div>

              {/* User Profile */}
              <div style={{ position: 'relative' }}>
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
                      style={{ fontSize: '0.95rem' }}
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

        {/* Header Main */}
        <div style={{ padding: '15px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
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
                    <Link 
                      to="/" 
                      className="text-decoration-none fw-medium"
                      style={{ 
                        color: '#333333',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      HOME
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/cong-thuc" 
                      className="text-decoration-none fw-medium"
                      style={{ 
                        color: '#333333',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      CÔNG THỨC
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/dien-dan" 
                      className="text-decoration-none fw-medium"
                      style={{ 
                        color: '#333333',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      DIỄN ĐÀN
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/blog" 
                      className="text-decoration-none fw-medium"
                      style={{ 
                        color: '#333333',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      BLOG
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/shopping-list" 
                      className="text-decoration-none fw-medium"
                      style={{ 
                        color: '#333333',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      SHOPPING LIST
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/meal-plan" 
                      className="text-decoration-none fw-medium"
                      style={{ 
                        color: '#333333',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}
                    >
                      KẾ HOẠCH BỮA ĂN
                    </Link>
                  </li>
                </ul>
              </nav>

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

      {/* Hero Section
      <section style={{ 
        padding: '40px 0', 
        textAlign: 'center',
        backgroundColor: styles.backgroundLight 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '3rem', 
            color: styles.primaryDark,
            marginBottom: '10px'
          }}>
            Bếp Việt 4.0
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#666666',
            maxWidth: '800px',
            margin: '0 auto 30px'
          }}>
            Khám phá – Chia sẻ – Gìn giữ tinh hoa ẩm thực Việt Nam
          </p>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '1.1rem',
            color: styles.primaryColor,
            fontWeight: '500',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              padding: '5px 15px',
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              borderRadius: '20px'
            }}>
              Miền Bắc
            </span>
            <span style={{ 
              padding: '5px 15px',
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              borderRadius: '20px'
            }}>
              Miền Trung
            </span>
            <span style={{ 
              padding: '5px 15px',
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              borderRadius: '20px'
            }}>
              Miền Nam
            </span>
          </div>
        </div>
      </section> */}

      {/* Main Content Area */}
      <main style={{ backgroundColor: styles.backgroundLight, minHeight: '60vh' }}>
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
                <i className="bi bi-utensils" style={{ color: styles.primaryColor, fontSize: '1.5rem' }}></i>
              </div>
              Bếp Việt 4.0
            </div>
            <p style={{ marginBottom: '20px', opacity: '0.8' }}>
              © 2028 BÁS VỌK 4D - Câu lạc bộ ẩm thực VN
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
              Bếp Việt 4.0 - Nơi gìn giữ hương vị Việt | Hotline: 1900 1234 | Email: contact@bepviet40.vn
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MemberLayout;