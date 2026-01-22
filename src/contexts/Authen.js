
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  //Hàm chuẩn hóa ngày, nếu trong vòng 24h thì hiện thị giờ
  const renderDate = (dateString) => {
    if (!dateString) return "Không xác định";

    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);

    // Dưới 1 phút
    if (diffInSeconds < 60) return "Vừa xong";

    // Dưới 1 tiếng
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    // Dưới 24 tiếng
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    // Dưới 7 ngày
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    // Nếu quá 7 ngày thì hiển thị ngày tháng bình thường (dùng hàm renderDate cũ của bạn)
    return new Date(dateString).toLocaleDateString('vi-VN');
  };
  const [api, SetApi] = useState('http://127.0.0.1:8000/api/');
  const [store, SetStore] = useState('http://localhost:8000/storage/');
  const [user, setUser] = useState({
    id: 1,
    username: 'nguyen_van_a',
    name: 'Nguyễn Văn A',
    role: 'guest',
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