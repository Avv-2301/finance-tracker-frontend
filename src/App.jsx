import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Transaction from "./pages/Transaction";
import { useAuthStore } from "./store/authStore";
import "./App.css";

export default function App() {
  const location = useLocation();
  const path = location.pathname;
  const isAuthPage = path === "/login" || path === "/signup";
  const [theme, setTheme] = useState(() => localStorage.getItem("kashflow-theme") || "dark");
  const user = useAuthStore((state) => state.user);
  const isAuthInitializing = useAuthStore((state) => state.isInitializing);
  const initializeAuth = useAuthStore((state) => state.initialize);
  const checkSession = useAuthStore((state) => state.checkSession);
  const sessionExpiresAt = useAuthStore((state) => state.sessionExpiresAt);
  const logoutFromStore = useAuthStore((state) => state.logout);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const clearExpiredSession = () => useAuthStore.getState().clearSession();
    window.addEventListener("kashflow:session-expired", clearExpiredSession);
    return () => window.removeEventListener("kashflow:session-expired", clearExpiredSession);
  }, []);

  useEffect(() => {
    if (!user || !sessionExpiresAt) return undefined;

    const checkForExpiredSession = () => {
      if (Date.now() >= sessionExpiresAt) {
        void checkSession();
      }
    };
    const timeout = window.setTimeout(
      checkForExpiredSession,
      Math.max(0, sessionExpiresAt - Date.now()),
    );

    document.addEventListener("visibilitychange", checkForExpiredSession);
    window.addEventListener("focus", checkForExpiredSession);

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("visibilitychange", checkForExpiredSession);
      window.removeEventListener("focus", checkForExpiredSession);
    };
  }, [user, sessionExpiresAt, checkSession]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("kashflow-theme", nextTheme);
    setTheme(nextTheme);
  }

  function openExpenseModal() {
    window.dispatchEvent(new Event("kashflow:open-expense-modal"));
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell" id="top" data-theme={theme}>
      <Header
        activePage={path === "/transaction" ? "transaction" : "dashboard"}
        onAdd={openExpenseModal}
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        isAuthInitializing={isAuthInitializing}
        onLogout={logoutFromStore}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
