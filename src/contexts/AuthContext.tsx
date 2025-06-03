import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    // Simulation d'authentification simple
    const mockUser = {
      id: '1',
      name: 'Admin User',
      email: email,
      role: 'admin' as const
    };
    setUser(mockUser);
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulation d'enregistrement simple
    const mockUser = {
      id: '1',
      name: name,
      email: email,
      role: 'user' as const
    };
    setUser(mockUser);
    navigate('/');
  };

  const value = {
    user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}