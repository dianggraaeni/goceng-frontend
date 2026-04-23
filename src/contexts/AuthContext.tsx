import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { buildApiUrl } from '@/lib/api';

// 1. Definisikan struktur data User
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profilePicture?: string | null;
}

// 2. Tambahkan 'user' ke dalam tipe Context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; 
  login: (token?: string, userData?: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fungsi untuk mengambil profil user dari backend
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(buildApiUrl('/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch authenticated user');
      }

      const result = await response.json();

      setUser({
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.profilePicture || undefined,
        profilePicture: result.profilePicture || null,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Cek token di URL (Hasil redirect Google)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      // Bersihkan URL dari parameter token
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserProfile(tokenFromUrl);
    } else {
      // 2. Cek token di localStorage
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        fetchUserProfile(savedToken);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const login = (token?: string, userData?: User) => {
    if (token) localStorage.setItem('token', token);
    if (userData) setUser(userData);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
