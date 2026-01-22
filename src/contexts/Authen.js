import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [api, SetApi] = useState('http://127.0.0.1:8000/api/');
  const [store, SetStore] = useState('http://localhost:8000/storage/');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, SetConfig] = useState(null);

  // 1. HÀM TỰ ĐỘNG LOGIN TỪ LOCALSTORAGE
  const autoLogin = async () => {
    const savedToken = localStorage.getItem('auth_token');
    console.log("token: "+savedToken)
    if (savedToken) {
      try {
        const response = await fetch(api + 'auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            setToken(savedToken);
            setUser(result.data);
          } else {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.log('Không thể kiểm tra token, dùng user đã lưu');
        setToken(savedToken);
      }
    }
    setLoading(false);
  };

  // 2. HÀM LOGIN - GỌI KHI USER ĐĂNG NHẬP
  const login = async (userData, authToken) => {
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    console.log(user)
    return true;
  };

  // 3. HÀM LOGOUT
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 4. TỰ ĐỘNG CHẠY KHI COMPONENT MOUNT
  useEffect(() => {
    autoLogin();
  }, []);

  // 5. GỌI API CONFIG
  useEffect(() => {
    fetch(api + 'config')
      .then(response => response.json())
      .then(data => SetConfig(data))
      .catch(err => console.error('Không thể tải config:', err));
  }, []);

  // 6. HÀM RENDER DATE (giữ nguyên)
  const renderDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);
    if (diffInSeconds < 60) return "Vừa xong";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // 7. LOADING SCREEN
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #d32f2f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '10px', color: '#666' }}>Đang tải...</p>
        </div>
      </div>
    );
  }
  
  // 8. PROVIDE CONTEXT VALUE
  return (
    <AuthContext.Provider value={{ 
      setUser, 
      login, 
      logout, 
      config, 
      api, 
      user, 
      SetApi, 
      store, 
      token,
      SetStore, 
      renderDate,
      isAuthenticated: !!user && !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};