import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/mockApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(api.getSession());
    setLoading(false);
  }, []);

  async function login(params) {
    const s = await api.login(params);
    setSession(s);
    return s;
  }

  async function adminLogin(params) {
    const s = await api.adminLogin(params);
    setSession(s);
    return s;
  }

  async function logout() {
    await api.logout();
    setSession(null);
  }

  function refreshSession() {
    setSession(api.getSession());
  }

  const value = {
    session,
    user: session?.user || null,
    role: session?.role || null,
    isAuthenticated: !!session,
    loading,
    login,
    adminLogin,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
