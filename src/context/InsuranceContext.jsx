import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../services/mockApi";
import { useAuth } from "./AuthContext";

const InsuranceContext = createContext(null);

export function InsuranceProvider({ children }) {
  const { user, role, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const filter = role === "merchant" ? { merchantId: user.id } : {};
    if (role === "merchant") {
      await api.checkDueReminders(user.id);
    }
    const [apps, pols, clms, pays, notifs] = await Promise.all([
      api.getApplications(filter),
      api.getPolicies(filter),
      api.getClaims(filter),
      api.getPayments(filter),
      api.getNotifications({ role, userId: user.id }),
    ]);
    setApplications(apps);
    setPolicies(pols);
    setClaims(clms);
    setPayments(pays);
    setNotifications(notifs);
    if (role === "admin") {
      setMerchants(await api.getMerchants());
    }
    setLoading(false);
  }, [isAuthenticated, role, user]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    applications,
    policies,
    claims,
    payments,
    notifications,
    merchants,
    unreadCount,
    loading,
    refreshAll,
  };

  return <InsuranceContext.Provider value={value}>{children}</InsuranceContext.Provider>;
}

export function useInsurance() {
  const ctx = useContext(InsuranceContext);
  if (!ctx) throw new Error("useInsurance must be used within InsuranceProvider");
  return ctx;
}
