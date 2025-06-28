'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

// Local User type definition
type User = {
  id: string;
  nombre: string;
  email: string;
  role?: string;
  rol?: string;
  permisos?: string[];
};

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('token');
      if (t) {
        setToken(t);
        try {
          setUser(jwtDecode<User>(t));
        } catch {
          setUser(null);
        }
      }
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      try {
        setUser(jwtDecode<User>(token));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (t: string) => {
    localStorage.setItem('token', t);
    setToken(t);
    router.push('/dashboard');
  };
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  };

  if (!isReady) return <div />;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
