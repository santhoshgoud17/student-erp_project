import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, TOKEN_KEY } from "./api";

export type Role = "student" | "faculty" | "admin";
export interface User { id: number; email: string; role: Role; is_active: boolean }

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) { setLoading(false); return; }
    api.get<User>("/api/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const form = new URLSearchParams({ username: email, password });
    const { data } = await api.post("/api/auth/login", form);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    const me = await api.get<User>("/api/auth/me");
    setUser(me.data);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
