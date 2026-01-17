
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [api, SetApi] = useState('http://127.0.0.1:8000/api/');
  const [store, SetStore] = useState('http://localhost:8000/storage');
  const [user, setUser] = useState({ role: 'd', name: 'Nguyen Van A', id: 3 });
  const [config, SetConfig] = useState(null);
  const logout = () => setUser(null);
  useEffect(() => {
    fetch(api + 'config').then(response => response.json())
      .then(data => SetConfig(data));
  }, [])
  return (
    <AuthContext.Provider value={{ user, logout, config, api, SetApi, store, SetStore }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};