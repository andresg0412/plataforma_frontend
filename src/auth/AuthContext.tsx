'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
// Define User type here if not available elsewhere
export interface User {
  id: number;
  nombre: string;
  email: string;
  id_roles: number;
  role: string;
  permisos?: string[];
  empresaId?: number | null;
  propietarioId?: number | null;
  inmuebles?: any[];
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (token: string, userData?: User) => void;
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
      const storedUser = localStorage.getItem('user');
      
      if (t) {
        setToken(t);
        
        // Intentar usar el usuario guardado primero
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (error) {
            try {
              const decoded = jwtDecode<User>(t);
              setUser(decoded);
            } catch (tokenError) {
              setUser(null);
            }
          }
        } else {
          // Si no hay usuario guardado, intentar decodificar del token
          try {
            const decoded = jwtDecode<User>(t);
            setUser(decoded);
          } catch (error) {
            setUser(null);
          }
        }
      }
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } catch (error) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (t: string, userData?: User) => {
    localStorage.setItem('token', t);
    setToken(t);
    
    // Si tenemos userData del servidor, usarlo directamente
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    router.push('/dashboard');
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
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
