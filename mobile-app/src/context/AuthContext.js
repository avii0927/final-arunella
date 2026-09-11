import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * ─────────────────────────────────────────────────────────────
 *  AuthContext – global session state for Arunella
 * ─────────────────────────────────────────────────────────────
 *  After a successful login the user object (Farmer / Buyer /
 *  Transporter entity returned by the backend) and their role
 *  string ('farmer' | 'buyer' | 'transporter') are stored here.
 *
 *  Every screen reads the session with:
 *    const { user, role } = useAuth();
 *    const userId = user?.userId;
 * ─────────────────────────────────────────────────────────────
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // full backend entity
  const [role, setRole] = useState(null);   // 'farmer' | 'buyer' | 'transporter'

  const login = useCallback((userData, userRole) => {
    setUser(userData);
    setRole(userRole);
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : updatedFields));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth() – hook to consume the auth context in any screen.
 * @returns {{ user: object|null, role: string|null, login: Function, logout: Function }}
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
