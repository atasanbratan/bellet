import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import api, { setTokens, getAccessToken } from '../api/client';
import type { AuthUser, Tokens } from '../types';

function decode(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.sub,
      role: payload.role,
      phone: payload.phone,
      name: payload.name ?? null,
    };
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  applyTokens: (tokens: Tokens) => void;
}

const AuthContext = createContext<AuthContextValue>(null!);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = getAccessToken();
    return token ? decode(token) : null;
  });

  const applyTokens = (tokens: Tokens) => {
    setTokens(tokens);
    setUser(decode(tokens.accessToken));
  };

  const login = async (phone: string, password: string) => {
    const res = await api.post('/auth/login', { phone, password });
    applyTokens(res.data);
  };

  const logout = async () => {
    const rt = localStorage.getItem('refreshToken');
    try {
      if (rt) await api.post('/auth/logout', { refreshToken: rt });
    } catch {
      /* ignore */
    }
    setTokens(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, applyTokens }}>
      {children}
    </AuthContext.Provider>
  );
}
