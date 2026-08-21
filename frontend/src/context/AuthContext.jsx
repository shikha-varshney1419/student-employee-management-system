import React, { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('sms_admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sms_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On first load, verify the stored token is still valid so a stale
    // token doesn't silently show a broken dashboard.
    async function verify() {
      const storedToken = localStorage.getItem('sms_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getProfile();
        setAdmin(res.admin);
        localStorage.setItem('sms_admin', JSON.stringify(res.admin));
      } catch {
        localStorage.removeItem('sms_token');
        localStorage.removeItem('sms_admin');
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, []);

  const login = useCallback(async (identifier, password) => {
    const res = await authService.login(identifier, password);
    localStorage.setItem('sms_token', res.token);
    localStorage.setItem('sms_admin', JSON.stringify(res.admin));
    setToken(res.token);
    setAdmin(res.admin);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the network call fails, clear the local session.
    }
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_admin');
    setToken(null);
    setAdmin(null);
  }, []);

  const value = {
    admin,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
