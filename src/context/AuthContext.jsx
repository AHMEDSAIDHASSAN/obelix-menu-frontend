import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('obelix_token'));

  const login = async (password) => {
    const res = await api.post('/auth/login', { password });
    localStorage.setItem('obelix_token', res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem('obelix_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
