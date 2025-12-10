import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/chat';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('crabbio-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, _password: string) => {
    // Mock login - in production, this would call your auth API
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      plan: 'free',
    };
    setUser(mockUser);
    localStorage.setItem('crabbio-user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, _password: string, name: string) => {
    // Mock signup
    const mockUser: User = {
      id: '1',
      email,
      name,
      plan: 'free',
    };
    setUser(mockUser);
    localStorage.setItem('crabbio-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crabbio-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
