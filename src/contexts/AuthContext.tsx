import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

// --- Data types ---

interface MessagingAccount {
  id: string;
  platform: 'WHATSAPP' | 'TELEGRAM';
  externalId: string;
  spreadsheetId?: string | null;
  googleDriveFolderId?: string | null;
  createdAt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profilePicture?: string | null;
  messagingAccounts?: MessagingAccount[];
}

// --- Context contract ---

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  messagingAccounts: MessagingAccount[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string) => void;
  login: (token?: string, userData?: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messagingAccounts, setMessagingAccounts] = useState<MessagingAccount[]>([]);
  const [selectedAccountId, _setSelectedAccountId] = useState<string | null>(
    localStorage.getItem('selectedAccountId')
  );

  // Persist selection in localStorage so apiFetch can read it synchronously
  const setSelectedAccountId = useCallback((id: string) => {
    localStorage.setItem('selectedAccountId', id);
    _setSelectedAccountId(id);
  }, []);

  // Fungsi untuk mengambil profil user dari backend
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await apiFetch('/auth/me');

      if (!response.ok) {
        throw new Error('Failed to fetch authenticated user');
      }

      const result = await response.json();

      // Parse messaging accounts from new backend schema (v2.0), falling back gracefully
      const accounts: MessagingAccount[] = Array.isArray(result.messagingAccounts)
        ? result.messagingAccounts
        : [];

      setUser({
        id: result.id,
        name: result.name,
        email: result.email,
        avatar: result.profilePicture || undefined,
        profilePicture: result.profilePicture || null,
        messagingAccounts: accounts,
      });

      setMessagingAccounts(accounts);

      // Restore previously-selected account, or default to the first one
      const saved = localStorage.getItem('selectedAccountId');
      const validSaved = saved && accounts.some((a) => a.id === saved);
      if (validSaved) {
        _setSelectedAccountId(saved);
      } else if (accounts.length > 0) {
        setSelectedAccountId(accounts[0].id);
      }

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
    localStorage.removeItem('selectedAccountId');
    setUser(null);
    setMessagingAccounts([]);
    _setSelectedAccountId(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        messagingAccounts,
        selectedAccountId,
        setSelectedAccountId,
        login,
        logout,
        loading,
      }}
    >
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
