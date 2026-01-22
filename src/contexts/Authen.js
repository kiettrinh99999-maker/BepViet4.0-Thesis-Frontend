import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [api, SetApi] = useState('http://127.0.0.1:8000/api/');
  const [store, SetStore] = useState('http://localhost:8000/storage');
  const [user, setUser] = useState({ role: 'member', name: 'Nguyen Van A' });
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