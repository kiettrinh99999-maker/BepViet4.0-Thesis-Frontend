
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  //Hàm chuẩn hóa ngày, nếu trong vòng 24h thì hiện thị giờ
  const renderDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return (
        <span style={{ color: 'green', fontWeight: 'bold' }}>
          Mới tạo ({Math.floor(diffInHours)}h trước)
        </span>
      );
    }
    return date.toLocaleDateString('vi-VN');
  };
  const [api, SetApi] = useState('http://127.0.0.1:8000/api/');
  const [store, SetStore] = useState('http://localhost:8000/storage/');
  const [user, setUser] = useState({
    id: 101,
    username: 'nguyen_van_a',
    name: 'Nguyễn Văn A',
    role: 'member',        
    email: 'vana@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    region_id: 1,  
    bio: 'Thích ăn ngon nhưng lười vào bếp.',
    created_at: '2023-05-20',
    stats: {
      followers: 12,
      following: 50,
      saved_recipes: 5
    }
  });
  const [config, SetConfig] = useState(null);
  const logout = () => setUser(null);
  //Gọi API config lấy dữ liệu để setting website
  useEffect(() => {
    fetch(api + 'config').then(response => response.json())
      .then(data => SetConfig(data));
  }, [])
  return (
    <AuthContext.Provider value={{ user, logout, config, api, SetApi, store, SetStore, renderDate }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};