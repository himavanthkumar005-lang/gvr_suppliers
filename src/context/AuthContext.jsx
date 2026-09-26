import React, { createContext, useContext, useState } from 'react';
import { dbService } from '../services/dbService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gvr_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const persist = (user) => {
    if (user) localStorage.setItem('gvr_auth_user', JSON.stringify(user));
    else localStorage.removeItem('gvr_auth_user');
    setCurrentUser(user);
  };

  // Try API first, then local fallback
  const login = async (email, password, requiredRole = null) => {
    try {
      const result = await dbService.loginWithApi(email, password, requiredRole);
      persist(result.user);
      return result.user;
    } catch {
      // local fallback
      const user = dbService.findUserByEmail(email);
      if (!user) throw new Error('No account found with this email address.');
      if (user.password !== password) throw new Error('Incorrect password. Please try again.');
      if (requiredRole && user.role !== requiredRole)
        throw new Error(`Access restricted: This account lacks ${requiredRole} privileges.`);
      const session = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone || '', address: user.address || '' };
      persist(session);
      return session;
    }
  };

  const register = async (userData) => {
    const newUser = await dbService.registerUser(userData);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone || '', address: newUser.address || '' };
    persist(session);
    return session;
  };

  const logout = () => persist(null);

  const loginDemoAdmin = () => login('admin@gvr.com', 'admin123', 'admin');
  const loginDemoUser = () => login('user@gvr.com', 'user123', 'user');

  const isAdmin = currentUser?.role === 'admin';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, isAdmin, login, register, logout, loginDemoAdmin, loginDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
