import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, tokenStore, type ApiUser } from "@/lib/api";

interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then((res) => setUser(res.user))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password });
    tokenStore.set(res.token);
    setUser(res.user);
  }

  async function signup(name: string, email: string, password: string) {
    const res = await authApi.signup({ name, email, password });
    tokenStore.set(res.token);
    setUser(res.user);
  }

  function logout() {
    authApi.logout().catch(() => {});
    tokenStore.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
