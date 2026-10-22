import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Transaction from "./pages/Transaction";
import "./App.css";

export default function App() {
  const location = useLocation();
  const path = location.pathname;
  const isAuthPage = path === "/login" || path === "/signup";
  const [theme, setTheme] = useState(() => localStorage.getItem("kashflow-theme") || "dark");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("kashflow-user-email") || "");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("kashflow-theme", nextTheme);
    setTheme(nextTheme);
  }

  function logout() {
    localStorage.removeItem("kashflow-user-email");
    setUserEmail("");
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
        userEmail={userEmail}
        onLogout={logout}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
