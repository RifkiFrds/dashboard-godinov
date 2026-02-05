import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './index';
import { setItemWithExpiry, getItemWithExpiry } from './storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = getItemWithExpiry("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/api/auth/user-info");
      const userData = response.data?.data || response.data || response;
      setUser(userData);
    } catch (error) {
      console.error("Fetch user error:", error);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, ttl = 18000000) => { // default 1 jam
    setLoading(true);
    setItemWithExpiry("token", token, ttl);
    await fetchUser(); // Ambil data user segera setelah token disimpan
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => { 
    fetchUser(); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, login, logout }}>
      {!loading ? children : (
        <div className="flex h-screen w-screen items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);